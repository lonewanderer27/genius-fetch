const Genius = require('../');
const accessToken = require('./accessToken');
const util = require('util');

const client = new Genius({ accessToken });

const name = 'All Around The World';
const options = {
  limit: 5,
  textFormat: 'plain',
  obtainFullInfo: true
};
return client.getSongsByName(name, options).then(result => {
  console.log(util.inspect(result, false, null, true));
});
