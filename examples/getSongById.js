const Genius = require('../');
const accessToken = require('./accessToken');
const util = require('util');

const client = new Genius({ accessToken });

const id = '378195';
const options = {
  textFormat: 'plain'
};
return client.getSongById(id, options).then(result => {
  console.log(util.inspect(result, false, null, true));
});
