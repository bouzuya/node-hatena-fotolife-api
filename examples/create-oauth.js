var fotolife = require('../'); // require('hatena-fotolife-api')

var client = fotolife({
  type: 'oauth',
  consumerKey: process.env.HATENA_CONSUMER_KEY,
  consumerSecret: process.env.HATENA_CONSUMER_SECRET,
  accessToken: process.env.HATENA_ACCESS_TOKEN,
  accessTokenSecret: process.env.HATENA_ACCESS_TOKEN_SECRET
});

// POST PostURI (/atom/post)
client.create({
  title: 'bouzuya\'s icon',
  file: './bouzuya.png'
}, function(err, res) {
  if (err) {
    console.error(err);
  } else {
    console.log('uploaded');
  }
});
