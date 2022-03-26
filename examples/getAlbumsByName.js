const Genius = require('../');
const accessToken = require('./accessToken');
const util = require('util');

const client = new Genius({ accessToken });

const name = 'Be Here Now';
const options = {
  limit: 5,
  textFormat: 'plain'
};
return client.getAlbumsByName(name, options).then(result => {
  console.log(util.inspect(result, false, null, true));
});
