import Album from './types/Album.js';
import Artist from './types/Artist.js';
import { TextFormat } from './types/Misc.js';
import Song from './types/Song.js';

export default class Parser {

  static parseArtist(data: any, textFormat:TextFormat = TextFormat.HTML) {
    if (!data || typeof data !== 'object' || !data.id || !data.name) {
      return null;
    }
    const result: Artist = {
      id: data.id,
      name: data.name
    };
    if (data.url) {
      result.url = data.url;
    }
    if (data.description?.[textFormat]) {
      result.description = data.description[textFormat];
    }
    if (data.image_url) {
      result.image = data.image_url;
    }

    return result;
  }

  static parseAlbum(data: any, textFormat: TextFormat = TextFormat.HTML) {
    if (!data || typeof data !== 'object' || !data.id || !data.name) {
      return null;
    }
    const result: Album = {
      id: data.id,
      title: {
        regular: data.name
      }
    };
    if (data.full_title) {
      result.title.full = data.full_title;
    }
    if (data.url) {
      result.url = data.url;
    }

    const annotations = data.description_annotation?.annotations;
    if (Array.isArray(annotations) && annotations.length > 0 && annotations[0]?.body?.[textFormat]) {
      result.description = annotations[0].body[textFormat];
    }

    const releaseDateComponents = data.release_date_components || {};
    const releaseDate: Album['releaseDate'] = {};
    if (releaseDateComponents.year) {
      releaseDate.year = releaseDateComponents.year;
    }
    if (releaseDateComponents.month) {
      releaseDate.month = releaseDateComponents.month;
    }
    if (releaseDateComponents.day) {
      releaseDate.day = releaseDateComponents.day;
    }
    if (data.release_date) {
      releaseDate.text = data.release_date;
    }
    if (Object.entries(releaseDate).length > 0) {
      result.releaseDate = releaseDate;
    }

    if (data.cover_art_url) {
      result.image = data.cover_art_url;
    }

    const artist = this.parseArtist(data.artist, textFormat);
    if (artist) {
      result.artist = artist;
    }

    return result;
  }

  static parseSong(data: any, textFormat: TextFormat = TextFormat.HTML) {
    if (!data || typeof data !== 'object' || !data.id || !data.title) {
      return null;
    }
    const result: Song = {
      id: data.id,
      title: {
        regular: data.title
      }
    };

    if (data.title_with_featured) {
      result.title.withFeatured = data.title_with_featured;
    }
    if (data.full_title) {
      result.title.full = data.full_title;
    }

    const artists: Song['artists'] = {};
    const primaryArtist = this.parseArtist(data.primary_artist, textFormat);
    if (primaryArtist) {
      artists.primary = primaryArtist;
    }
    const featuredArtistsData = data.featured_artists;
    if (Array.isArray(featuredArtistsData)) {
      const featuredArtists = featuredArtistsData.reduce<Artist[]>((parsed, artistData) => {
        const artist = this.parseArtist(artistData, textFormat);
        if (artist) {
          parsed.push(artist);
        }
        return parsed;
      }, []);
      if (featuredArtists.length > 0) {
        artists.featured = featuredArtists;
      }
    }
    if (data.artist_names) {
      artists.text = data.artist_names;
    }
    if (Object.entries(artists).length > 0) {
      result.artists = artists;
    }

    const album = this.parseAlbum(data.album, textFormat);
    if (album) {
      result.album = album;
    }

    if (data.description?.[textFormat]) {
      result.description = data.description[textFormat];
    }
    if (data.release_date) {
      result.releaseDate = data.release_date;
    }
    if (data.song_art_image_url) {
      result.image = data.song_art_image_url;
    }
    if (data.lyrics_state) {
      result.hasLyrics = data.lyrics_state === 'complete';
    }
    if (data.embed_content) {
      result.embed = data.embed_content;
    }

    return result;
  }
}
