const Genius = require('../');
const accessToken = require('./accessToken');
const util = require('util');

const client = new Genius({ accessToken });

const id = '498';
const options = {
  textFormat: 'dom'
};
return client.getArtistById(id, options).then(result => {
  console.log(util.inspect(result, false, null, true));
});
