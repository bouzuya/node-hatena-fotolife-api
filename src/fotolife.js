var Fotolife, fs, mime, oauth, request, wsse, xml2js;

fs = require('fs');

mime = require('mime');

oauth = require('oauth');

request = require('request');

wsse = require('wsse');

xml2js = require('xml2js');

// Hatena::Fotolife API wrapper
//
// - POST   PostURI (/atom/post)                => Fotolife#create
// - PUT    EditURI (/atom/edit/XXXXXXXXXXXXXX) => Fotolife#update
// - DELETE EditURI (/atom/edit/XXXXXXXXXXXXXX) => Fotolife#destroy
// - GET    EditURI (/atom/edit/XXXXXXXXXXXXXX) => Fotolife#show
// - GET    FeedURI (/atom/feed)                => Fotolife#index
Fotolife = (function() {
  Fotolife.BASE_URL = 'http://f.hatena.ne.jp';

  // constructor
  // params:
  //   options: (required)
  //   - type     : authentication type. default `'wsse'`
  //   (type 'wsse')
  //   - username : wsse authentication username. (required)
  //   - apikey   : wsse authentication apikey. (required)
  //   (type 'oauth')
  //   - consumerKey       : oauth consumer key. (required)
  //   - consumerSecret    : oauth consumer secret. (required)
  //   - accessToken       : oauth access token. (required)
  //   - accessTokenSecret : oauth access token secret. (required)
  function Fotolife(arg) {
    var accessToken, accessTokenSecret, apikey, consumerKey, consumerSecret, type, username;
    type = arg.type, username = arg.username, apikey = arg.apikey, consumerKey = arg.consumerKey, consumerSecret = arg.consumerSecret, accessToken = arg.accessToken, accessTokenSecret = arg.accessTokenSecret;
    this._type = type != null ? type : 'wsse';
    this._username = username;
    this._apikey = apikey;
    this._consumerKey = consumerKey;
    this._consumerSecret = consumerSecret;
    this._accessToken = accessToken;
    this._accessTokenSecret = accessTokenSecret;
  }

  // POST PostURI (/atom/post)
  // params:
  //   options: (required)
  //   - file     : 'content'. image file path. (required)
  //   - title    : 'title'. image title. default `''`.
  //   - type     : 'type'. content-type. default `mime.lookup(file)`.
  //   - folder   : 'dc:subject'. folder name. default `undefined`.
  //   - generator: 'generator'. tool name. default `undefined`.
  //   callback:
  //   - err: error
  //   - res: response
  // returns:
  //   Promise
  Fotolife.prototype.create = function(arg, callback) {
    var body, encoded, file, folder, generator, method, path, statusCode, title, type;
    file = arg.file, title = arg.title, type = arg.type, folder = arg.folder, generator = arg.generator;
    if (file == null) {
      return this._reject('options.file is required', callback);
    }
    if (!fs.existsSync(file)) {
      return this._reject('options.file does not exist', callback);
    }
    title = title != null ? title : '';
    type = type != null ? type : mime.lookup(file);
    encoded = fs.readFileSync(file).toString('base64');
    method = 'post';
    path = '/atom/post';
    body = {
      entry: {
        $: {
          xmlns: 'http://purl.org/atom/ns#'
        },
        title: {
          _: title
        },
        content: {
          $: {
            mode: 'base64',
            type: type
          },
          _: encoded
        }
      }
    };
    if (folder != null) {
      body.entry['dc:subject'] = {
        _: folder
      };
    }
    if (generator != null) {
      body.entry.generator = {
        _: generator
      };
    }
    statusCode = 201;
    return this._request({
      method: method,
      path: path,
      body: body,
      statusCode: statusCode
    }, callback);
  };

  // PUT EditURI (/atom/edit/XXXXXXXXXXXXXX)
  // params:
  //   options: (required)
  //   - id    : image id. (required)
  //   - title : 'title'. image title. (required)
  //   callback:
  //   - err: error
  //   - res: feed
  // returns:
  //   Promise
  Fotolife.prototype.update = function(arg, callback) {
    var body, id, method, path, statusCode, title;
    id = arg.id, title = arg.title;
    if (id == null) {
      return this._reject('options.id is required', callback);
    }
    if (title == null) {
      return this._reject('options.title is required', callback);
    }
    method = 'put';
    path = '/atom/edit/' + id;
    body = {
      entry: {
        $: {
          xmlns: 'http://purl.org/atom/ns#'
        },
        title: {
          _: title
        }
      }
    };
    statusCode = 200;
    return this._request({
      method: method,
      path: path,
      body: body,
      statusCode: statusCode
    }, callback);
  };

  // DELETE EditURI (/atom/edit/XXXXXXXXXXXXXX)
  // params:
  //   options: (required)
  //   - id: image id. (required)
  //   callback:
  //   - err: error
  //   - res: response
  // returns:
  //   Promise
  Fotolife.prototype.destroy = function(arg, callback) {
    var id, method, path, statusCode;
    id = arg.id;
    if (id == null) {
      return this._reject('options.id is required', callback);
    }
    method = 'delete';
    path = '/atom/edit/' + id;
    statusCode = 200;
    return this._request({
      method: method,
      path: path,
      statusCode: statusCode
    }, callback);
  };

  // GET EditURI (/atom/edit/XXXXXXXXXXXXXX)
  // params:
  //   options: (required)
  //   - id: image id. (required)
  //   callback:
  //   - err: error
  //   - res: response
  // returns:
  //   Promise
  Fotolife.prototype.show = function(arg, callback) {
    var id, method, path, statusCode;
    id = arg.id;
    if (id == null) {
      return this._reject('options.id is required', callback);
    }
    method = 'get';
    path = '/atom/edit/' + id;
    statusCode = 200;
    return this._request({
      method: method,
      path: path,
      statusCode: statusCode
    }, callback);
  };

  // GET FeedURI (/atom/feed)
  // params:
  //   options:
  //   callback:
  //   - err: error
  //   - res: response
  // returns:
  //   Promise
  Fotolife.prototype.index = function(options, callback) {
    var method, path, statusCode;
    if (callback == null) {
      callback = options;
    }
    method = 'get';
    path = '/atom/feed';
    statusCode = 200;
    return this._request({
      method: method,
      path: path,
      statusCode: statusCode
    }, callback);
  };

  Fotolife.prototype._reject = function(message, callback) {
    var e;
    try {
      e = new Error(message);
      if (callback != null) {
        callback(e);
      }
      return Promise.reject(e);
    } catch (error) {
      return Promise.reject(e);
    }
  };

  Fotolife.prototype._request = function(arg, callback) {
    var body, method, params, path, promise, statusCode, token;
    method = arg.method, path = arg.path, body = arg.body, statusCode = arg.statusCode;
    callback = callback != null ? callback : (function() {});
    params = {};
    params.method = method;
    params.url = Fotolife.BASE_URL + path;
    if (this._type === 'oauth') {
      params.oauth = {
        consumer_key: this._consumerKey,
        consumer_secret: this._consumerSecret,
        token: this._accessToken,
        token_secret: this._accessTokenSecret
      };
    } else { // this._type === 'wsse'
      token = wsse().getUsernameToken(this._username, this._apikey, {
        nonceBase64: true
      });
      params.headers = {
        'Authorization': 'WSSE profile="UsernameToken"',
        'X-WSSE': 'UsernameToken ' + token
      };
    }
    promise = body != null ? this._toXml(body) : Promise.resolve(null);
    return promise.then((function(_this) {
      return function(body) {
        if (body != null) {
          params.body = body;
        }
        return _this._requestPromise(params);
      };
    })(this)).then((function(_this) {
      return function(res) {
        if (res.statusCode !== statusCode) {
          throw new Error("HTTP status code is " + res.statusCode);
        }
        return _this._toJson(res.body);
      };
    })(this)).then(function(json) {
      callback(null, json);
      return json;
    }).then(null, function(err) {
      callback(err);
      throw err;
    });
  };

  Fotolife.prototype._requestPromise = function(params) {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return _this._rawRequest(params, function(err, res) {
          if (err != null) {
            return reject(err);
          } else {
            return resolve(res);
          }
        });
      };
    })(this));
  };

  Fotolife.prototype._toJson = function(xml) {
    return new Promise(function(resolve, reject) {
      var parser;
      parser = new xml2js.Parser({
        explicitArray: false,
        explicitCharkey: true
      });
      return parser.parseString(xml, function(err, result) {
        if (err != null) {
          return reject(err);
        } else {
          return resolve(result);
        }
      });
    });
  };

  Fotolife.prototype._toXml = function(json) {
    var builder, e, xml;
    builder = new xml2js.Builder();
    try {
      xml = builder.buildObject(json);
      return Promise.resolve(xml);
    } catch (error) {
      e = error;
      return Promise.reject(e);
    }
  };

  Fotolife.prototype._rawRequest = request;

  Fotolife.prototype._mime = mime;

  return Fotolife;

})();

module.exports = Fotolife;
