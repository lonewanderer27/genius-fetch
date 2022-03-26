const Genius = require('../');
const accessToken = require('./accessToken');
const util = require('util');

const client = new Genius({ accessToken });

const matchParams = {
  name: 'Be Here Now',
  releaseYear: 1997,
};
const options = {
  limit: 5,
  textFormat: 'plain'
};
return client.getAlbumsByBestMatch(matchParams, options).then(result => {
  console.log(util.inspect(result, false, null, true));
});
