import Genius, { TextFormat } from '../dist/mjs/index.js';
import accessToken from './accessToken.js';
import util from 'util';

const client = new Genius({ accessToken });

const id = '498';
const options = {
  textFormat: TextFormat.DOM
};

client.getArtistById(id, options).then((result) => {
  console.log(util.inspect(result, false, null, true));
});
