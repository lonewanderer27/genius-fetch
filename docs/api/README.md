genius-fetch

# genius-fetch

## Table of contents

### Enumerations

- [ItemType](enums/ItemType.md)
- [TextFormat](enums/TextFormat.md)

### Classes

- [Genius](classes/Genius.md)

### Interfaces

- [Album](interfaces/Album.md)
- [Artist](interfaces/Artist.md)
- [GeniusConfig](interfaces/GeniusConfig.md)
- [GetItemByIdOptions](interfaces/GetItemByIdOptions.md)
- [GetItemsByBestMatchOptions](interfaces/GetItemsByBestMatchOptions.md)
- [GetItemsByNameOptions](interfaces/GetItemsByNameOptions.md)
- [GetItemsResult](interfaces/GetItemsResult.md)
- [Song](interfaces/Song.md)
- [SongEmbedContents](interfaces/SongEmbedContents.md)

### Type Aliases

- [GetAlbumsByBestMatchParams](README.md#getalbumsbybestmatchparams)
- [GetSongsByBestMatchParams](README.md#getsongsbybestmatchparams)
- [ItemOf](README.md#itemof)
- [LimiterOptions](README.md#limiteroptions)
- [RequireAtLeastOne](README.md#requireatleastone)

## Type Aliases

### GetAlbumsByBestMatchParams

Ƭ **GetAlbumsByBestMatchParams**: { `name`: `string`  } & [`RequireAtLeastOne`](README.md#requireatleastone)<{ `artist`: `string` ; `releaseDay`: `number` ; `releaseMonth`: `number` ; `releaseYear`: `number`  }\>

#### Defined in

[Genius.ts:49](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/Genius.ts#L49)

___

### GetSongsByBestMatchParams

Ƭ **GetSongsByBestMatchParams**: { `name`: `string`  } & [`RequireAtLeastOne`](README.md#requireatleastone)<{ `album`: `string` ; `artist`: `string`  }\>

#### Defined in

[Genius.ts:42](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/Genius.ts#L42)

___

### ItemOf

Ƭ **ItemOf**<`T`\>: `T` extends [`Song`](enums/ItemType.md#song) ? [`Song`](interfaces/Song.md) : `T` extends [`Album`](enums/ItemType.md#album) ? [`Album`](interfaces/Album.md) : `T` extends [`Artist`](enums/ItemType.md#artist) ? [`Artist`](interfaces/Artist.md) : `never`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ItemType`](enums/ItemType.md) |

#### Defined in

[types/Misc.ts:17](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/types/Misc.ts#L17)

___

### LimiterOptions

Ƭ **LimiterOptions**: `Bottleneck.ConstructorOptions`

#### Defined in

[utils/Limiter.ts:3](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/utils/Limiter.ts#L3)

___

### RequireAtLeastOne

Ƭ **RequireAtLeastOne**<`T`\>: { [K in keyof T]-?: Required<Pick<T, K\>\> & Partial<Pick<T, Exclude<keyof T, K\>\>\> }[keyof `T`]

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[types/Misc.ts:24](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/types/Misc.ts#L24)
