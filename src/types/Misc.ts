import Album from './Album.js';
import Artist from './Artist.js';
import Song from './Song.js';

export enum TextFormat {
  HTML = 'html',
  Plain = 'plain',
  DOM = 'dom'
}

export enum ItemType {
  Song = 'song',
  Album = 'album',
  Artist = 'artist'
}

export type ItemOf<T extends ItemType> =
  T extends ItemType.Song ? Song :
  T extends ItemType.Album ? Album :
  T extends ItemType.Artist ? Artist :
  never;

// https://learn.microsoft.com/en-us/javascript/api/@azure/keyvault-certificates/requireatleastone?view=azure-node-latest
export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>
}[keyof T]
