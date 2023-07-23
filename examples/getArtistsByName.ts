import Genius, { TextFormat } from '../dist/mjs/index.js';
import accessToken from './accessToken.js';
import util from 'util';

const client = new Genius({ accessToken });

const name = 'Beyonce';
const options = {
  textFormat: TextFormat.Plain,
  obtainFullInfo: true
};

client.getArtistsByName(name, options).then((result) => {
  console.log(util.inspect(result, false, null, true));
});
