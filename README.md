# hatena-fotolife-api

Hatena::Fotolife API wrapper for Node.js (unofficial)

## Installation

    $ npm install hatena-fotolife-api

## Usage

See [`examples/`](examples/).

### Coding style (Callback/Promise)

#### Callback style

```javascript
var fotolife = require('hatena-fotolife-api');

var client = fotolife({ type: 'wsse', username: 'username', apikey: 'apikey' });
var options = { title: 'bouzuya\'s icon', file: './bouzuya.png' };

client.create(options, function(err) {
  if (err) {
    console.error(err);
  } else {
    console.log('uploaded');
  }
});
```

#### Promise style

```javascript
var fotolife = require('hatena-fotolife-api');

var client = fotolife({ type: 'wsse', username: 'username', apikey: 'apikey' });
var options = { title: 'bouzuya\'s icon', file: './bouzuya.png' };

client.create(options).then(function() {
  console.log('uploaded');
}, function(err) {
  console.error(err);
});
```

### Configuration (WSSE/OAuth)

#### WSSE

See ["How to use Hatena WSSE"](http://developer.hatena.ne.jp/ja/documents/auth/apis/wsse).

- username ... Your username.
- apikey ... See [AtomPub API key](http://blog.hatena.ne.jp/my/config/detail).

#### OAuth

See ["How to use Hatena OAuth"](http://developer.hatena.ne.jp/ja/documents/auth/apis/oauth).

Application scope is "read_private" or "write_private" or both.

```javascript
var fotolife = require('hatena-fotolife-api');

var client = fotolife({
  type: 'oauth',
  consumerKey: 'consumerKey',
  consumerSecret: 'consumerSecret',
  accessToken: 'accessToken',
  accessTokenSecret: 'accessTokenSecret'
});

// ...
```

## API Docs

See [Hatena::Fotolife Atom API](http://developer.hatena.ne.jp/ja/documents/fotolife/apis/atom), [`test/`](test/) and [`examples/`](examples/).

## Development

`npm run`

## License

[MIT](LICENSE)

## Author

[bouzuya][user] &lt;[m@bouzuya.net][mail]&gt; ([http://bouzuya.net][url])

## Badges

[![Build Status][travis-badge]][travis]
[![Dependencies status][david-dm-badge]][david-dm]
[![Coverage Status][coveralls-badge]][coveralls]

[travis]: https://travis-ci.org/bouzuya/node-hatena-fotolife-api
[travis-badge]: https://travis-ci.org/bouzuya/node-hatena-fotolife-api.svg?branch=master
[david-dm]: https://david-dm.org/bouzuya/node-hatena-fotolife-api
[david-dm-badge]: https://david-dm.org/bouzuya/node-hatena-fotolife-api.png
[coveralls]: https://coveralls.io/r/bouzuya/node-hatena-fotolife-api
[coveralls-badge]: https://img.shields.io/coveralls/bouzuya/node-hatena-fotolife-api.svg
[user]: https://github.com/bouzuya
[mail]: mailto:m@bouzuya.net
[url]: http://bouzuya.net
