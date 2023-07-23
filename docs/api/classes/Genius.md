[genius-fetch](../README.md) / Genius

# Class: Genius

## Table of contents

### Constructors

- [constructor](Genius.md#constructor)

### Properties

- [MAX\_LIMIT](Genius.md#max_limit)

### Methods

- [clearCache](Genius.md#clearcache)
- [config](Genius.md#config)
- [getAlbumByBestMatch](Genius.md#getalbumbybestmatch)
- [getAlbumById](Genius.md#getalbumbyid)
- [getAlbumsByBestMatch](Genius.md#getalbumsbybestmatch)
- [getAlbumsByName](Genius.md#getalbumsbyname)
- [getArtistById](Genius.md#getartistbyid)
- [getArtistsByName](Genius.md#getartistsbyname)
- [getSongByBestMatch](Genius.md#getsongbybestmatch)
- [getSongById](Genius.md#getsongbyid)
- [getSongsByBestMatch](Genius.md#getsongsbybestmatch)
- [getSongsByName](Genius.md#getsongsbyname)
- [parseSongEmbed](Genius.md#parsesongembed)

## Constructors

### constructor

• **new Genius**(`config?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`GeniusConfig`](../interfaces/GeniusConfig.md) |

#### Defined in

[Genius.ts:135](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/Genius.ts#L135)

## Properties

### MAX\_LIMIT

▪ `Static` **MAX\_LIMIT**: `number` = `MAX_LIMIT`

#### Defined in

[Genius.ts:128](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/Genius.ts#L128)

## Methods

### clearCache

▸ **clearCache**(): `void`

#### Returns

`void`

#### Defined in

[Genius.ts:175](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/Genius.ts#L175)

___

### config

▸ **config**(`options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`GeniusConfig`](../interfaces/GeniusConfig.md) |

#### Returns

`void`

#### Defined in

[Genius.ts:142](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/Genius.ts#L142)

___

### getAlbumByBestMatch

▸ **getAlbumByBestMatch**(`matchParams`, `options?`): `Promise`<``null`` \| [`Album`](../interfaces/Album.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `matchParams` | [`GetAlbumsByBestMatchParams`](../README.md#getalbumsbybestmatchparams) |
| `options?` | [`GetItemsByBestMatchOptions`](../interfaces/GetItemsByBestMatchOptions.md) |

#### Returns

`Promise`<``null`` \| [`Album`](../interfaces/Album.md)\>

#### Defined in

[Genius.ts:467](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/Genius.ts#L467)

___

### getAlbumById

▸ **getAlbumById**(`id`, `options?`): `Promise`<``null`` \| [`Album`](../interfaces/Album.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `options?` | [`GetItemByIdOptions`](../interfaces/GetItemByIdOptions.md) |

#### Returns

`Promise`<``null`` \| [`Album`](../interfaces/Album.md)\>

#### Defined in

[Genius.ts:412](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/Genius.ts#L412)

___

### getAlbumsByBestMatch

▸ **getAlbumsByBestMatch**(`matchParams`, `options?`): `Promise`<[`Album`](../interfaces/Album.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `matchParams` | [`GetAlbumsByBestMatchParams`](../README.md#getalbumsbybestmatchparams) |
| `options?` | [`GetItemsByBestMatchOptions`](../interfaces/GetItemsByBestMatchOptions.md) |

#### Returns

`Promise`<[`Album`](../interfaces/Album.md)[]\>

#### Defined in

[Genius.ts:420](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/Genius.ts#L420)

___

### getAlbumsByName

▸ **getAlbumsByName**(`name`, `options?`): `Promise`<[`GetItemsResult`](../interfaces/GetItemsResult.md)<[`Album`](../enums/ItemType.md#album)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `options?` | [`GetItemsByNameOptions`](../interfaces/GetItemsByNameOptions.md) |

#### Returns

`Promise`<[`GetItemsResult`](../interfaces/GetItemsResult.md)<[`Album`](../enums/ItemType.md#album)\>\>

#### Defined in

[Genius.ts:416](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/Genius.ts#L416)

___

### getArtistById

▸ **getArtistById**(`id`, `options?`): `Promise`<``null`` \| [`Artist`](../interfaces/Artist.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `options?` | [`GetItemByIdOptions`](../interfaces/GetItemByIdOptions.md) |

#### Returns

`Promise`<``null`` \| [`Artist`](../interfaces/Artist.md)\>

#### Defined in

[Genius.ts:474](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/Genius.ts#L474)

___

### getArtistsByName

▸ **getArtistsByName**(`name`, `options?`): `Promise`<[`GetItemsResult`](../interfaces/GetItemsResult.md)<[`Artist`](../enums/ItemType.md#artist)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `options?` | [`GetItemsByNameOptions`](../interfaces/GetItemsByNameOptions.md) |

#### Returns

`Promise`<[`GetItemsResult`](../interfaces/GetItemsResult.md)<[`Artist`](../enums/ItemType.md#artist)\>\>

#### Defined in

[Genius.ts:478](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/Genius.ts#L478)

___

### getSongByBestMatch

▸ **getSongByBestMatch**(`matchParams`, `options?`): `Promise`<``null`` \| [`Song`](../interfaces/Song.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `matchParams` | [`GetSongsByBestMatchParams`](../README.md#getsongsbybestmatchparams) |
| `options?` | [`GetItemsByBestMatchOptions`](../interfaces/GetItemsByBestMatchOptions.md) |

#### Returns

`Promise`<``null`` \| [`Song`](../interfaces/Song.md)\>

#### Defined in

[Genius.ts:405](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/Genius.ts#L405)

___

### getSongById

▸ **getSongById**(`id`, `options?`): `Promise`<``null`` \| [`Song`](../interfaces/Song.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `options?` | [`GetItemByIdOptions`](../interfaces/GetItemByIdOptions.md) |

#### Returns

`Promise`<``null`` \| [`Song`](../interfaces/Song.md)\>

#### Defined in

[Genius.ts:360](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/Genius.ts#L360)

___

### getSongsByBestMatch

▸ **getSongsByBestMatch**(`matchParams`, `options?`): `Promise`<(``null`` \| [`Song`](../interfaces/Song.md))[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `matchParams` | [`GetSongsByBestMatchParams`](../README.md#getsongsbybestmatchparams) |
| `options?` | [`GetItemsByBestMatchOptions`](../interfaces/GetItemsByBestMatchOptions.md) |

#### Returns

`Promise`<(``null`` \| [`Song`](../interfaces/Song.md))[]\>

#### Defined in

[Genius.ts:368](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/Genius.ts#L368)

___

### getSongsByName

▸ **getSongsByName**(`name`, `options?`): `Promise`<[`GetItemsResult`](../interfaces/GetItemsResult.md)<[`Song`](../enums/ItemType.md#song)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `options?` | [`GetItemsByNameOptions`](../interfaces/GetItemsByNameOptions.md) |

#### Returns

`Promise`<[`GetItemsResult`](../interfaces/GetItemsResult.md)<[`Song`](../enums/ItemType.md#song)\>\>

#### Defined in

[Genius.ts:364](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/Genius.ts#L364)

___

### parseSongEmbed

▸ **parseSongEmbed**(`embedValue`): `Promise`<``null`` \| [`SongEmbedContents`](../interfaces/SongEmbedContents.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `embedValue` | `string` |

#### Returns

`Promise`<``null`` \| [`SongEmbedContents`](../interfaces/SongEmbedContents.md)\>

#### Defined in

[Genius.ts:540](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/Genius.ts#L540)
