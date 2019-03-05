var fotolife = require('../lib/').default; // require('hatena-fotolife-api')

var client = fotolife({
  type: 'wsse',
  username: process.env.HATENA_USERNAME, // 'username'
  apikey: process.env.HATENA_APIKEY      // 'apikey'
});

// POST PostURI (/atom/post)
client.create({
  title: 'bouzuya\'s icon',
  file: './bouzuya.png',

  folder: 'bouzuya-icon',
  generator: 'hatena-fotolife-api example'

}, function(err, res) {
  if (err) {
    console.error(err);
  } else {
    console.log('uploaded');
  }
});
