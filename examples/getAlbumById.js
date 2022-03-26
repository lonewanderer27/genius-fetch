const Genius = require('../');
const accessToken = require('./accessToken');
const util = require('util');

const client = new Genius({ accessToken });

const id = '65407';
const options = {
  textFormat: 'html'
};
return client.getAlbumById(id, options).then(result => {
  console.log(util.inspect(result, false, null, true));
});
