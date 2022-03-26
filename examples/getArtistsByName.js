const Genius = require('../');
const accessToken = require('./accessToken');
const util = require('util');

const client = new Genius({ accessToken });

const name = 'Beyonce';
const options = {
  textFormat: 'plain',
  obtainFullInfo: true
};
return client.getArtistsByName(name, options).then(result => {
  console.log(util.inspect(result, false, null, true));
});
