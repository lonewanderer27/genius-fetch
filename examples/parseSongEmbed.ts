import Genius, { TextFormat } from '../dist/mjs/index.js';
import accessToken from './accessToken.js';
import util from 'util';

const client = new Genius({ accessToken });

const id = '378195';
const options = {
  textFormat: TextFormat.Plain
};

client.getSongById(id, options).then((result) => {
  if (result) {
    if (result.embed) {
      return client.parseSongEmbed(result.embed).then((parsed) => {
        console.log(util.inspect(parsed, false, null, true));
      });
    }
    console.log('Song does not have embed contents!');
  }
  else {
    console.log('Song not found!');
  }
});
