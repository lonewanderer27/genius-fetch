[genius-fetch](../README.md) / Song

# Interface: Song

## Table of contents

### Properties

- [album](Song.md#album)
- [artists](Song.md#artists)
- [description](Song.md#description)
- [embed](Song.md#embed)
- [hasLyrics](Song.md#haslyrics)
- [id](Song.md#id)
- [image](Song.md#image)
- [releaseDate](Song.md#releasedate)
- [title](Song.md#title)
- [url](Song.md#url)

## Properties

### album

• `Optional` **album**: [`Album`](Album.md)

#### Defined in

[types/Song.ts:17](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/types/Song.ts#L17)

___

### artists

• `Optional` **artists**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `featured?` | [`Artist`](Artist.md)[] |
| `primary?` | [`Artist`](Artist.md) |
| `text?` | `string` |

#### Defined in

[types/Song.ts:12](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/types/Song.ts#L12)

___

### description

• `Optional` **description**: `string`

#### Defined in

[types/Song.ts:18](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/types/Song.ts#L18)

___

### embed

• `Optional` **embed**: `string`

#### Defined in

[types/Song.ts:22](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/types/Song.ts#L22)

___

### hasLyrics

• `Optional` **hasLyrics**: `boolean`

#### Defined in

[types/Song.ts:21](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/types/Song.ts#L21)

___

### id

• **id**: `string`

#### Defined in

[types/Song.ts:5](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/types/Song.ts#L5)

___

### image

• `Optional` **image**: `string`

#### Defined in

[types/Song.ts:20](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/types/Song.ts#L20)

___

### releaseDate

• `Optional` **releaseDate**: `string`

#### Defined in

[types/Song.ts:19](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/types/Song.ts#L19)

___

### title

• **title**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `full?` | `string` |
| `regular` | `string` |
| `withFeatured?` | `string` |

#### Defined in

[types/Song.ts:6](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/types/Song.ts#L6)

___

### url

• `Optional` **url**: `string`

#### Defined in

[types/Song.ts:11](https://github.com/patrickkfkan/genius-fetch/blob/984708d/src/types/Song.ts#L11)
