# genius-fetch

A JS library for fetching data from [Genius](https://genius.com/) . Requires a Genius Access Token for certain functions.

# Installation

```
npm i genius-fetch --save
```

# Initialization

```
const Genius = require('genius-fetch');

const client = new Genius({
  // Config options go here
});


// You can change or set a config option after initialization. E.g:

client.config({
  accessToken: ...
  debug: true
  ...
});
```

| **Config option**  | **Description**                                                                                                                                                              |
|--------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| accessToken        | Genius Access Token. Certain  API calls require this to be provided.                                                                                                         |
| rateLimiterEnabled | Whether to rate limit network requests. Default: `true`.                                                                                                                        |
| rateLimiterOptions | Options passed to the rate limiter, which is just a wrapper around [Bottleneck](https://www.npmjs.com/package/bottleneck) and thus takes the same [Bottleneck settings](https://www.npmjs.com/package/bottleneck#docs). <br></br>Default: ```{ maxConcurrent: 5,   minTime: 100 }```|
| cacheEnabled       | Whether to cache network responses. Default: `true`.                                                                                                                            |
| cacheTTL           | The time-to-live of cache entries (seconds). Default: 3600.                                                                                                                   |
| maxCacheEntries    | The maximum number of cache entries. Once reached, older entries will be removed. Default: 200.                                                                               |
| debug              | Whether to log debug messages to the console. Default: `false`.                                                                                                                 |

# Usage

```
const matchParams = {
  name: 'Evermore',
  artist: 'Taylor Swift',
};
const options = {
  textFormat: 'plain',
  obtainFullInfo: true
};
return client.getSongsByBestMatch(matchParams, options).then(result => {
  // Do something with result
});
```

# API

Each function returns a Promise which resolves to the fetched data.

## Fetching by ID

### `getSongById(id, options)`
### `getAlbumById(id, options)`
### `getArtistById(id, options)`

Fetches a resource by ID. Requires Genius Access Token.


| Option     | Description                                                    |
|------------|----------------------------------------------------------------|
| textFormat | Formatting to apply, where applicable: `html`, `plain` or `dom`. Default: `html`. |
| raw        | Whether to return raw data. Default `false`.                   |

Returns an object representing the requested resource.

## Fetching by Name

### `getSongsByName(name, options)`
### `getAlbumsByName(name, options)`
### `getArtistsByName(name, options)`

Fetches resources matching `name`. Genius Access Token required if `obtainFullInfo` is set to `true` in `options`.

| Option         | Description                                                                                                                                                                                                                                                    |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| limit          | The number of results to return (max: 50). Default: 10.                                                                                                                                                                                                        |
| offset         | The offset from which to return results. Default: 0 (i.e. return from first record).                                                                                                                                                                           |
| obtainFullInfo | Whether to fetch full info for each result by calling `get<Song/Album/Artist>ById()`. If `false`, only snippet info will be returned. If `true`, you should make sure you have configured the library with the `accessToken` config option. Default: `false`. |
| textFormat     | Formatting to apply, where applicable: `html`, `plain` or `dom`. Default: `html`.                                                                                                                                                                              |
| raw            | Whether to return raw data. Default `false`.                                                                                                                                                                                                                   |

Returns an object with the following properties:

| **Property** | **Description**                                         |
|--------------|---------------------------------------------------------|
| q            | The name searched.                                      |
| items        | An array of objects representing the fetched resources. |
| limit        | The number of results requested.                        |
| offset       | The offset from which results are returned.             |

## Fetching by Best Match

### `getSongsByBestMatch(matchParams, options)`

Returns an array of songs that best matches the criteria specified by `matchParams`, ordered by relevance. Requires Genius Access Token if `album` is specified in `matchParams`, or `obtainFullInfo` is set to `true` in `options`.

This function performs matching on a "best attempt" basis, and does not guarantee that the results returned will fully match the values specified in `matchParams`.

| Match Param | Description                            |
|-------------|----------------------------------------|
| name        | *Required*. The name of the song.      |
| artist      | Artist                                 |
| album       | Album                                  |

You **must** specify `name` and *at least* one of `artist` and `album` in `matchParams`.

| Option         | Description                                                                                                                                                                                                                                                    |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| limit          | The number of results to return (max: 50). Default: 10.                                                                                                                                                                                                        |
| sampleSize         | The number of songs to fetch for best-matching. If it is smaller than `limit`, it will automatically be set to the same value as `limit`. Default: 20.                                                                                                                                                                           |
| textFormat     | Formatting to apply, where applicable: `html`, `plain` or `dom`. Default: `html`.                                                                                                                                                                              |
| obtainFullInfo* | Whether to fetch full info for each result by calling `getSongById()`. If `false`, only snippet info will be returned. If `true`, you should make sure you have configured the library with the `accessToken` config option. Default: `false`. |

*If `album` is specified in `matchParams`, then `obtainFullInfo` will be overridden with `true`. This is because the best-match logic requires full info to be obtained.

### `getSongByBestMatch(matchParams, options)`

Convenience function that calls `getSongsByBestMatch()` and returns the first result (or `null` if no result is found).

### `getAlbumsByBestMatch(matchParams, options)`

Returns an array of albums that best matches the criteria specified by `matchParams`, ordered by relevance. Requires Genius Access Token if `releaseYear`, `releaseMonth` or `releaseDay` is specified in `matchParams`, or `obtainFullInfo` is set to `true` in `options`.

This function performs matching on a "best attempt" basis, and does not guarantee that the results returned will fully match the values specified in `matchParams`.

| Match Param  | Description                            |
|--------------|----------------------------------------|
| name         | *Required*. The name of the album.     |
| artist       | Artist                                 |
| releaseYear  | Year of release.                       |
| releaseMonth | Month of release.                      |
| releaseDay   | Day of release.                        |

You **must** specify `name` and *at least* one of the other parameters in `matchParams`.

| Option         | Description                                                                                                                                                                                                                                                    |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| limit          | The number of results to return (max: 50). Default: 10.                                                                                                                                                                                                        |
| sampleSize         | The number of albums to fetch for best-matching. If it is smaller than `limit`, it will automatically be set to the same value as `limit`. Default: 20.                                                                                                                                                                           |
| textFormat     | Formatting to apply, where applicable: `html`, `plain` or `dom`. Default: `html`.                                                                                                                                                                              |
| obtainFullInfo* | Whether to fetch full info for each result by calling `getSongById()`. If `false`, only snippet info will be returned. If `true`, you should make sure you have configured the library with the `accessToken` config option. Default: `false`. |

*If `releaseYear`, `releaseMonth` or `releaseDay` is specified in `matchParams`, then `obtainFullInfo` will be overridden with `true`. This is because the best-match logic requires full info to be obtained.

### `getAlbumByBestMatch(matchParams, options)`

Convenience function that calls `getAlbumsByBestMatch()` and returns the first result (or `null` if no result is found).

## Util Functions

### `parseSongEmbed(embedValue)`

Parses the contents of the embed link contained in a song resource's `embed` property.

Returns an object with the following properties:

| **Property** | **Description**                                                    |
|--------------|--------------------------------------------------------------------|
| linkElements | Array of \<link\> elements found in the embed content.               |
| contentParts | Array of HTML elements comprising the 'body' of the embed content. |

# Changelog

0.1.0
- Initial release

# License

MIT
