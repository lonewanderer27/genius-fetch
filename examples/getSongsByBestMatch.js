const Genius = require('../');
const accessToken = require('./accessToken');
const util = require('util');

const client = new Genius({ accessToken });

const matchParams = {
  name: 'All Around The World',
  artist: 'Oasis',
  album: 'Be Here Now'
};
const options = {
  limit: 5,
  textFormat: 'plain'
};
return client.getSongsByBestMatch(matchParams, options).then(result => {
  console.log(util.inspect(result, false, null, true));
});
