import fetch, { Headers } from 'node-fetch';
import { stringSimilarity } from 'string-similarity-js';
import unescapeJS from 'unescape-js';
import Parser from './Parser.js';
import Limiter, { LimiterOptions } from './utils/Limiter.js';
import Cache from './utils/Cache.js';
import { ItemOf, ItemType, RequireAtLeastOne, TextFormat } from './types/Misc.js';
import Album from './types/Album.js';
import Song from './types/Song.js';
import GeniusError from './utils/GeniusError.js';

export interface GeniusConfig {
  accessToken?: string;
  rateLimiterEnabled?: boolean;
  rateLimiterOptions?: LimiterOptions;
  cacheEnabled?: boolean;
  cacheTTL?: number;
  maxCacheEntries?: number;
  debug?: boolean;
}

export interface GetItemByIdOptions {
  textFormat?: TextFormat;
  raw?: boolean;
}

export interface GetItemsByNameOptions {
  limit?: number;
  offset?: number;
  obtainFullInfo?: boolean;
  textFormat?: TextFormat;
  raw?: boolean;
}

export interface GetItemsResult<T extends ItemType> {
  q: string | null;
  items: ItemOf<T>[];
  limit: number;
  offset: number;
}

export type GetSongsByBestMatchParams = {
  name: string;
} & RequireAtLeastOne<{
  artist: string;
  album: string;
}>

export type GetAlbumsByBestMatchParams = {
  name: string;
} & RequireAtLeastOne<{
  artist: string;
  releaseYear: number;
  releaseMonth: number;
  releaseDay: number;
}>

export interface GetItemsByBestMatchOptions {
  limit?: number;
  sampleSize?: number;
  textFormat?: TextFormat;
  obtainFullInfo?: boolean;
}

export interface SongEmbedContents {
  linkElements: string[];
  contentParts: string[];
}

type SearchAndParseOptions = GetItemsByNameOptions & GetItemsByBestMatchOptions;

interface SearchHits {
  q: string | null;
  hits: any[];
  limit: number;
  offset: number;
}

interface BestMatchCompareValueCallbacks<T extends Song | Album> {
  /**
   * @returns Base value for comparison.
   */
  compareValue: () => string;
  /**
   * Extracts value for comparison with value returned by `compare()`.
   * @param item
   * @returns
   */
  compareWith: (item: T) => string;
  /**
   * Takes `matchScore` and, based on `item`, returns a value that
   * better represents the match score
   * @param item
   * @param matchScore
   * @returns
   */
  postCompare?: (item: T, matchScore: number) => number;
}

interface BestMatchCompareTarget<T extends Song | Album> {
  item: T;
  matchScore: number;
}

const DEV_API_BASE_URL = 'https://api.genius.com/';
const WEB_API_BASE_URL = 'https://genius.com/api/';

const DEFAULT_CONFIG: GeniusConfig = {
  rateLimiterEnabled: true,
  rateLimiterOptions: {
    maxConcurrent: 5,
    minTime: 100
  },
  cacheEnabled: true,
  cacheTTL: 3600,
  maxCacheEntries: 200,
  debug: false
};

const MAX_PER_PAGE = 20;
const MAX_LIMIT = 50;
const DEFAULT_BEST_MATCH_SAMPLE_SIZE = 20;

const STRIP_PARENTHESES = /\((?:[^)(]|\([^)(]*\))*\)/gm;

export default class Genius {

  static MAX_LIMIT = MAX_LIMIT;

  #limiter: Limiter;
  #cache: Cache;
  #requestHeaders: Headers;
  #debug: boolean;

  constructor(config: GeniusConfig = {}) {
    this.#limiter = new Limiter();
    this.#cache = new Cache();
    this.config(DEFAULT_CONFIG);
    this.config(config);
  }

  config(options: GeniusConfig) {
    if (options.accessToken) {
      this.#requestHeaders = new Headers({
        'Authorization': `Bearer ${options.accessToken}`
      });
    }

    if (options.debug !== undefined) {
      this.#debug = options.debug;
      this.#cache.setDebug(options.debug);
    }

    if (options.rateLimiterEnabled !== undefined) {
      this.#limiter.setEnabled(options.rateLimiterEnabled);
    }

    if (options.rateLimiterOptions) {
      this.#limiter.setOptions(options.rateLimiterOptions);
    }

    if (options.cacheEnabled !== undefined) {
      this.#cache.setEnabled(options.cacheEnabled);
    }

    if (options.cacheTTL !== undefined) {
      this.#cache.setTTL('res', options.cacheTTL);
    }

    if (options.maxCacheEntries !== undefined) {
      this.#cache.setMaxEntries('res', options.maxCacheEntries);
    }
  }

  clearCache() {
    this.#cache.clear('res');
  }

  async #search(q: string | string[], type: ItemType, options: SearchAndParseOptions = {}, qIndex = 0): Promise<SearchHits> {
    const {limit = 10, offset = 0} = options;
    const _limit = Math.min(limit, MAX_LIMIT);
    const pageStart = Math.trunc(offset / MAX_PER_PAGE) + 1;
    const pageStartOffset = offset % MAX_PER_PAGE;
    const pageEnd = Math.trunc((offset + limit) / MAX_PER_PAGE) + ((offset + limit) % MAX_PER_PAGE > 0 ? 1 : 0);
    const endpoint = `search/${type}`;
    const currentQ = Array.isArray(q) ? q[qIndex] || null : q;
    const result: SearchHits = {
      q: currentQ,
      hits: [],
      limit: _limit,
      offset
    };
    if (!currentQ) {
      return result;
    }
    this.#debugMessage(`[genius-fetch] #search(): q='${currentQ}' type=${type} limit=${_limit} offset=${offset}`);
    this.#debugMessage(`[genius-fetch] #search(): Fetching hits from pages ${pageStart} to ${pageEnd} of search results`);
    const fetches = [];
    for (let page = pageStart; page <= pageEnd; page++) {
      fetches.push(this.#fetchWebApiEndpoint(endpoint, {
        q: currentQ,
        per_page: MAX_PER_PAGE,
        page}));
    }
    const searchResults = await Promise.all(fetches);
    const handleSearchResults = (results: any) => {
      if (results.response) {
        const sections = results.response?.sections;
        if (Array.isArray(sections)) {
          const section = sections.find((s) => s.type === type);
          if (section && Array.isArray(section.hits)) {
            return section.hits;
          }
        }
        this.#debugMessage('[genius-fetch] #search(): Warning - response missing expected props.');
        return [];
      }

      this.#throwError('[genius-fetch] Search error.', results);

    };
    const allHits = searchResults.reduce((accumulated, results) => {
      const hits = handleSearchResults(results);
      accumulated.push(...hits);
      return accumulated;
    }, []);
    if (allHits.length === 0) {
      this.#debugMessage(`[genius-fetch] #search(): No hits for '${currentQ}'`);
      if (Array.isArray(q) && qIndex + 1 < q.length) {
        this.#debugMessage('[genius-fetch] #search(): Retrying with next in q array');
        return this.#search(q, type, options, qIndex + 1);
      }
    }
    else {
      result.hits = allHits.slice(pageStartOffset, pageStartOffset + _limit);
    }
    this.#debugMessage(`[genius-fetch] #search(): Returning ${result.hits.length} of total ${allHits.length} hits, starting from offset ${pageStartOffset}`);
    return result;
  }

  #parseItem<T extends ItemType>(data: any, type: T, textFormat: TextFormat) {
    this.#debugMessage(`[genius-fetch] #parseItem(): Parsing ${type} with id=${data.id}`);
    switch (type) {
      case ItemType.Song:
        return Parser.parseSong(data, textFormat);
      case ItemType.Album:
        return Parser.parseAlbum(data, textFormat);
      case ItemType.Artist:
        return Parser.parseArtist(data, textFormat);
      default:
        this.#throwError(`[genius-fetch] #parseItem(): Unknown type ${type}`);
    }
  }

  async #searchAndParse<T extends ItemType>(q: string | string[], type: T, options: SearchAndParseOptions = {}): Promise<GetItemsResult<T>> {
    const {textFormat = TextFormat.HTML, raw = false, obtainFullInfo = false} = options;
    const {q: searchedQ, hits, limit, offset} = await this.#search(q, type, options);
    const fetches = [];
    if (obtainFullInfo) {
      for (const hit of hits) {
        if (hit.type === 'song') {
          fetches.push(this.getSongById(hit.result.id, {textFormat, raw}));
        }
        else if (hit.type === 'album') {
          fetches.push(this.getAlbumById(hit.result.id, {textFormat, raw}));
        }
        else if (hit.type === 'artist') {
          fetches.push(this.getArtistById(hit.result.id, {textFormat, raw}));
        }
        else {
          this.#debugMessage(`[genius-fetch] #searchAndParse(): Warning - unrecognized type '${hit.type}'`);
        }
      }
    }
    else {
      for (const hit of hits) {
        if (raw) {
          fetches.push(Promise.resolve(hit.result));
        }
        else if (hit.result) {
          const parsed = this.#parseItem(hit.result, hit.type, textFormat);
          if (parsed !== null) {
            fetches.push(Promise.resolve(parsed));
          }
        }
      }
    }
    const items = (await Promise.all(fetches)).filter((item) => item !== null);
    this.#debugMessage(`[genius-fetch] #searchAndParse(): Processed ${items.length} items.`);
    return {
      q: searchedQ,
      items,
      limit,
      offset
    };
  }

  async #getItemById<T extends ItemType>(id: string, type: T, options: GetItemByIdOptions = {}): Promise<ItemOf<T> | null> {
    this.#debugMessage(`[genius-fetch] #getItemById(): type=${type} id=${id}`);
    const {textFormat = TextFormat.HTML, raw = false} = options;
    const endpoint = `${type}s/${id}`;
    const fetchOp = await this.#fetchDevApiEndpoint(endpoint, {text_format: textFormat});
    if (fetchOp.response) {
      const data = fetchOp.response[type];
      return raw ? data : this.#parseItem(data, type, textFormat);
    }
    else if (fetchOp.meta?.status === 404) {
      this.#debugMessage(`[genius-fetch] #getItemById(): 404 Not Found for type=${type} id=${id}`);
      return null;
    }

    this.#throwError(`[genius-fetch] Unable to fetch ${type} with id=${id}.`, fetchOp);

  }

  #sanitizeBestMatchOptions(options: SearchAndParseOptions = {}) {
    const {limit = 10, sampleSize = DEFAULT_BEST_MATCH_SAMPLE_SIZE} = options;
    const _limit = Math.min(limit, MAX_LIMIT);
    const _sampleSize = Math.max(Math.min(sampleSize, MAX_LIMIT), _limit);
    return {
      ...options,
      limit: _limit,
      sampleSize: _sampleSize
    };
  }

  #generateMatchScoreAndSort<T extends Song | Album>(items: T[], compareValueCallbacks: BestMatchCompareValueCallbacks<T>, debugItemTitle: (item: T) => string, limit = 10) {
    const parenthesisRegExp = /\(|\)/gm; // Remove parentheses before matching
    const {compareValue, compareWith, postCompare} = compareValueCallbacks;
    const _compareValue = compareValue().replace(parenthesisRegExp, '');
    this.#debugMessage(`[genius-fetch] #generateMatchScoreAndSort(): Obtaining match scores with compare value '${_compareValue}'...`);
    const compareTargets = items.map((item, i) => {
      const compareWithValue = compareWith(item).replace(parenthesisRegExp, '');
      let matchScore = stringSimilarity(_compareValue, compareWithValue);
      if (postCompare) {
        matchScore = postCompare(item, matchScore);
      }
      const target: BestMatchCompareTarget<T> = {
        item,
        matchScore
      };
      this.#debugMessage(`${i}. [genius-fetch] #generateMatchScoreAndSort(): Compare with #${item.id} - '${compareWithValue}'; score: ${matchScore}`);
      return target;
    });
    const comparator = (item1: BestMatchCompareTarget<T>, item2: BestMatchCompareTarget<T>) => (item2.matchScore - item1.matchScore);
    const sortedTargets = compareTargets.sort(comparator);
    const sorted = compareTargets.map((target) => target.item);
    this.#debugMessage('[genius-fetch] #generateMatchScoreAndSort(): ------ Items ordered by match score ------');
    sortedTargets.forEach((target, i) => {
      const item = target.item;
      this.#debugMessage(`[genius-fetch] ${i}. #${item.id} - '${debugItemTitle(item)}'; score: ${target.matchScore}`);
    });
    const results = sorted.slice(0, limit);
    this.#debugMessage(`[genius-fetch] #generateMatchScoreAndSort(): Returning ${results.length} items.`);
    return results;
  }

  // Songs

  async getSongById(id: string, options?: GetItemByIdOptions) {
    return this.#getItemById(id, ItemType.Song, options);
  }

  async getSongsByName(name: string, options?: GetItemsByNameOptions) {
    return this.#searchAndParse(name, ItemType.Song, options);
  }

  async getSongsByBestMatch(matchParams: GetSongsByBestMatchParams, options?: GetItemsByBestMatchOptions) {
    const {name, artist, album} = matchParams as any;
    const {limit, textFormat, sampleSize, obtainFullInfo = false} = this.#sanitizeBestMatchOptions(options);
    if (!name) {
      this.#throwError('[genius-fetch] getSongsByBestMatch(): name not specified in matchParams');
    }
    if (!artist && !album) {
      this.#throwError('[genius-fetch] getSongsByBestMatch(): You must specify at least \'artist\' or \'album\' in matchParams');
    }
    this.#debugMessage(`[genius-fetch] getSongsByBestMatch(): name='${name}' artist='${artist}' album='${album}' limit=${limit} sampleSize=${sampleSize}`);

    const searchNames = this.#getBestMatchSearchNames(matchParams);
    const matchRequiresFullInfo = album;
    const songs = await this.#searchAndParse(searchNames, ItemType.Song, {textFormat, limit: sampleSize, obtainFullInfo: matchRequiresFullInfo});
    if (songs.items.length > 0) {
      const compareValue = () => (`${name} ${artist || ''} ${album || ''}`);
      const compareWith = (item: Song) => {
        return `${item.title.full} ${
          //(artist ? song.artists.text : '') + ' ' +  // No need to include this because full title already has it
          album && item.album ? item.album.title.full : ''}`;
      };
      const debugItemTitle = (item: Song) => item.title.full || item.title.regular;
      const sortedItems = this.#generateMatchScoreAndSort(songs.items, {compareValue, compareWith}, debugItemTitle, limit);
      if (obtainFullInfo && !matchRequiresFullInfo) {
        const fetches = sortedItems.map( (item) => this.getSongById(item.id, {textFormat}) );
        return await Promise.all(fetches);
      }

      return sortedItems;

    }

    this.#debugMessage('[genius-fetch] getSongsByBestMatch(): No items found. Returning empty result.');
    return [];

  }

  async getSongByBestMatch(matchParams: GetSongsByBestMatchParams, options?: GetItemsByBestMatchOptions) {
    const songs = await this.getSongsByBestMatch(matchParams, {...options, limit: 1});
    return songs.length > 0 ? songs[0] : null;
  }

  // Albums

  async getAlbumById(id: string, options?: GetItemByIdOptions) {
    return this.#getItemById(id, ItemType.Album, options);
  }

  async getAlbumsByName(name: string, options?: GetItemsByNameOptions) {
    return this.#searchAndParse(name, ItemType.Album, options);
  }

  async getAlbumsByBestMatch(matchParams: GetAlbumsByBestMatchParams, options?: GetItemsByBestMatchOptions): Promise<Album[]> {
    const {name, artist, releaseYear, releaseMonth, releaseDay} = matchParams;
    const {limit, textFormat, sampleSize, obtainFullInfo = false} = this.#sanitizeBestMatchOptions(options);
    if (!name) {
      this.#throwError('[genius-fetch] getAlbumsByBestMatch(): name not specified in matchParams');
    }
    if (!artist && !releaseDay && !releaseMonth && !releaseYear) {
      this.#throwError('[genius-fetch] getAlbumsByBestMatch(): You must specify at least \'artist\', \'releaseYear\', \'releaseMonth\' or \'releaseDay\' in matchParams');
    }
    this.#debugMessage(`[genius-fetch] getAlbumsByBestMatch(): name='${name}' artist='${artist}' releaseYear='${releaseYear}' releaseMonth='${releaseMonth}' releaseDay='${releaseDay}' limit=${limit} sampleSize=${sampleSize}`);

    const searchNames = this.#getBestMatchSearchNames(matchParams);
    const matchRequiresFullInfo = !!(releaseYear || releaseMonth || releaseDay);
    const albums = await this.#searchAndParse(searchNames, ItemType.Album, {textFormat, limit: sampleSize, obtainFullInfo: matchRequiresFullInfo});
    if (albums.items.length > 0) {
      const compareValue = () => (`${name} ${artist || ''}`);
      const compareWith = (item: Album) => {
        return item.title.full || item.title.regular;
        //(artist ? item.artist.name : '') + ' ' +  // No need to include this because full title already has it
      };
      const getDateScore = (year?: number, month?: number, day?: number) => {
        const yearScore = releaseYear ? (releaseYear === year ? 1 : 0.8) : 1;
        const monthScore = releaseMonth ? (releaseMonth === month ? 1 : 0.8) : 1;
        const dayScore = releaseDay ? (releaseDay === day ? 1 : 0.8) : 1;
        return yearScore * monthScore * monthScore * dayScore;
      };
      const postCompare = (item: Album, matchScore: number) => {
        const {year, month, day} = item.releaseDate || {};
        return getDateScore(year, month, day) * matchScore;
      };
      const debugItemTitle = (item: Album) => item.title.full || item.title.regular;
      const sortedItems = this.#generateMatchScoreAndSort(albums.items, {compareValue, compareWith, postCompare}, debugItemTitle, limit);
      if (obtainFullInfo && !matchRequiresFullInfo) {
        const fetches = sortedItems.map((item) => this.getAlbumById(item.id, {textFormat}));
        const fetchResults = await Promise.all(fetches);
        return fetchResults.filter((item) => item !== null) as Album[];
      }

      return sortedItems;

    }

    this.#debugMessage('[genius-fetch] getAlbumsByBestMatch(): No items found. Returning empty result.');
    return [];

  }

  async getAlbumByBestMatch(matchParams: GetAlbumsByBestMatchParams, options?: GetItemsByBestMatchOptions) {
    const albums = await this.getAlbumsByBestMatch(matchParams, {...options, limit: 1});
    return albums.length > 0 ? albums[0] : null;
  }

  // Artists

  async getArtistById(id: string, options?: GetItemByIdOptions) {
    return this.#getItemById(id, ItemType.Artist, options);
  }

  async getArtistsByName(name: string, options?: GetItemsByNameOptions) {
    return this.#searchAndParse(name, ItemType.Artist, options);
  }


  #getBestMatchSearchNames(matchParams: GetAlbumsByBestMatchParams | GetSongsByBestMatchParams) {
    const {name, artist} = matchParams;
    const retryName = name.replace(STRIP_PARENTHESES, '').trim();
    const searchNames = [
      name + (artist ? ` ${artist}` : '')
    ];
    if (retryName !== '') {
      searchNames.push(retryName + (artist ? ` ${artist}` : ''));
    }
    if (artist) {
      searchNames.push(name);
      if (retryName !== '') {
        searchNames.push(retryName);
      }
    }
    return searchNames;
  }

  async #fetchDevApiEndpoint(endpoint: string, params?: Record<string, string | number>) {
    if (!this.#requestHeaders) {
      this.#throwError('[genius-fetch] Error: accessToken not specified in config.');
    }
    const urlObj = new URL(endpoint, DEV_API_BASE_URL);
    if (params) {
      for (const [ name, value ] of Object.entries(params)) {
        urlObj.searchParams.set(name, value.toString());
      }
    }
    const url = urlObj.toString();
    //Const url = DEV_API_BASE_URL + endpoint + (params ? '?' + (new URLSearchParams(params).toString()) : '');
    this.#debugMessage(`[genius-fetch] #fetchDevApiEndpoint(): Requesting: ${url}`);
    return this.#cache.getOrSet('res', url, async () => {
      const res = await this.#limiter.schedule(fetch.bind(this, url, {
        headers: this.#requestHeaders
      }));
      this.#debugMessage(`[genius-fetch] #fetchDevApiEndpoint(): Response received from: ${url}`);
      return res.json();
    });
  }

  async #fetchWebApiEndpoint(endpoint: string, params?: Record<string, string | number>) {
    const urlObj = new URL(endpoint, WEB_API_BASE_URL);
    if (params) {
      for (const [ name, value ] of Object.entries(params)) {
        urlObj.searchParams.set(name, value.toString());
      }
    }
    const url = urlObj.toString();
    //Const url = WEB_API_BASE_URL + endpoint + (params ? '?' + (new URLSearchParams(params).toString()) : '');
    this.#debugMessage(`[genius-fetch] #fetchWebApiEndpoint(): Requesting: ${url}`);
    return this.#cache.getOrSet('res', url, async () => {
      const res = await this.#limiter.schedule(fetch.bind(this, url));
      this.#debugMessage(`[genius-fetch] #fetchWebApiEndpoint(): Response received from: ${url}`);
      return res.json();
    });
  }

  async parseSongEmbed(embedValue: string) {
    if (!embedValue) {
      return null;
    }
    const result: SongEmbedContents = {
      linkElements: [],
      contentParts: []
    };
    const embedJSRegexp = /<script.*?src='(.*?)'><\/script>/gm;
    const embedJSMatch = embedJSRegexp.exec(embedValue);
    const matchUrl = embedJSMatch?.find( (url) => url.startsWith('//genius.com') && url.endsWith('embed.js') );
    if (matchUrl) {
      const jsUrl = `https:${matchUrl}`;
      this.#debugMessage(`[genius-fetch] parseSongEmbed(): Found embed.js URL: ${jsUrl}. Retrieving contents...`);
      const res = await this.#limiter.schedule(fetch.bind(this, jsUrl));
      const jsContents = await res.text();

      // Get <link> elements (e.g. stylesheets)
      const linkElRegexp = /<link href=.*?\/>/gm;
      const linkElMatch = jsContents.match(linkElRegexp);
      if (linkElMatch) {
        result.linkElements = linkElMatch.map( (link) => unescapeJS(link) );
        this.#debugMessage(`[genius-fetch] parseSongEmbed(): Found ${result.linkElements.length} <link> elements`);
      }

      // Get contents
      result.contentParts = this.#getSongEmbedContents(jsContents);
      this.#debugMessage(`[genius-fetch] parseSongEmbed(): Found ${result.contentParts.length} content parts`);

      return result;
    }

    this.#debugMessage('[genius-fetch] parseSongEmbed(): Could not find embed.js URL');
    return null;

  }

  #getSongEmbedContents(js: string) {
    // Regexp for getting value passed to 'JSON.parse(...)'
    const jsonStrRegExp = /json\.parse\((?:'|")(.*?)(?<!\\)(?:'|")/gmi;

    const parts = [];
    const matches = js.matchAll(jsonStrRegExp);
    for (const match of matches) {
      try {
        parts.push(JSON.parse(unescapeJS(match[1])));
      }
      catch (e) {
        this.#debugMessage('[genius-fetch] #getSongEmbedContents(): Warning - Failed to parse JSON string');
      }
    }
    return parts;
  }

  #debugMessage(msg: string) {
    if (this.#debug) {
      console.log(msg);
    }
  }

  #throwError(msg: string, res?: any): never {
    const {meta, error, error_description: errorDescription} = res || {};
    const {status: metaStatus, message: metaMessage} = meta || {};
    const err = error ?
      new GeniusError(`${msg} Response: ${error} - ${errorDescription}`)
      :
      new GeniusError(msg + (meta ? `Response: ${metaStatus} - ${metaMessage}` : ''));
    if (error) {
      err.statusCode = error;
      err.statusMessage = errorDescription;
    }
    else if (meta) {
      err.statusCode = metaStatus;
      err.statusMessage = metaMessage;
    }
    throw err;
  }
}
