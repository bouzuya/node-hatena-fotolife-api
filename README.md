# hatena-fotolife-api

Hatena::Fotolife API wrapper for Node.js (unofficial)

## Installation

    $ npm install hatena-fotolife-api

## Example

```javascript
var fotolife = require('hatena-fotolife-api');

var client = fotolife({ type: 'wsse', username: 'username', apikey: 'apikey' });
client.create({
  title: 'bouzuya\'s icon',
  type: 'image/png',
  content: './bouzuya.png'
}, function(err) {
  if (err) {
    console.error(err);
  } else {
    console.log('uploaded');
  }
});
```

See [`examples/`](examples/).

## API Docs

See [Hatena::Fotolife Atom API](http://developer.hatena.ne.jp/ja/documents/fotolife/apis/atom) and [`test/`](test/).

## Development

### Test

    $ npm test

### Build

    $ npm run build

## License

[MIT](LICENSE)

## Author

[bouzuya][user] &lt;[m@bouzuya.net][mail]&gt; ([http://bouzuya.net][url])

## Badges

[![Build Status][travis-badge]][travis]
[![Dependencies status][david-dm-badge]][david-dm]

[travis]: https://travis-ci.org/bouzuya/hatena-fotolife-api
[travis-badge]: https://travis-ci.org/bouzuya/hatena-fotolife-api.svg?branch=master
[david-dm]: https://david-dm.org/bouzuya/hatena-fotolife-api
[david-dm-badge]: https://david-dm.org/bouzuya/hatena-fotolife-api.png
[user]: https://github.com/bouzuya
[mail]: mailto:m@bouzuya.net
[url]: http://bouzuya.net
