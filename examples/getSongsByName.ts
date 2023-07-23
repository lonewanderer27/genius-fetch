import Genius, { TextFormat } from '../dist/mjs/index.js';
import accessToken from './accessToken.js';
import util from 'util';

const client = new Genius({ accessToken });

const name = 'All Around The World';
const options = {
  limit: 5,
  textFormat: TextFormat.Plain,
  obtainFullInfo: true
};

client.getSongsByName(name, options).then((result) => {
  console.log(util.inspect(result, false, null, true));
});
