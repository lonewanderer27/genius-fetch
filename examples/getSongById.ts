import Genius, { TextFormat } from '../dist/mjs/index.js';
import accessToken from './accessToken.js';
import util from 'util';

const client = new Genius({ accessToken });

const id = '378195';
const options = {
  textFormat: TextFormat.Plain
};

client.getSongById(id, options).then((result) => {
  console.log(util.inspect(result, false, null, true));
});
