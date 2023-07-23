import Genius, { TextFormat } from '../dist/mjs/index.js';
import accessToken from './accessToken.js';
import util from 'util';

const client = new Genius({ accessToken });

const name = 'Be Here Now';
const options = {
  limit: 5,
  textFormat: TextFormat.Plain
};

client.getAlbumsByName(name, options).then((result) => {
  console.log(util.inspect(result, false, null, true));
});
