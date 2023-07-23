import Genius, { TextFormat } from '../dist/mjs/index.js';
import accessToken from './accessToken.js';
import util from 'util';

const client = new Genius({ accessToken });

const matchParams = {
  name: 'Be Here Now',
  releaseYear: 1997
};
const options = {
  limit: 5,
  textFormat: TextFormat.Plain
};

client.getAlbumsByBestMatch(matchParams, options).then((result) => {
  console.log(util.inspect(result, false, null, true));
});
