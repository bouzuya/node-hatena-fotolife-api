
import fs from 'fs';
import mime from 'mime';
import oauth from 'oauth';
import request from 'request';
import wsse from 'wsse';
import xml2js from 'xml2js';

type FotolifeOptions = FotolifeOptionsOAuth | FotolifeOptionsWSSE;

interface FotolifeOptionsOAuth {
  accessToken: string;
  accessTokenSecret: string;
  consumerKey: string;
  consumerSecret: string;
  type: 'oauth';
}

interface FotolifeOptionsWSSE {
  apikey: string;
  type?: 'wsse';
  username: string;
}

type XMLObject = any;

// Hatena::Fotolife API wrapper
//
// - POST   PostURI (/atom/post)                => Fotolife#create
// - PUT    EditURI (/atom/edit/XXXXXXXXXXXXXX) => Fotolife#update
// - DELETE EditURI (/atom/edit/XXXXXXXXXXXXXX) => Fotolife#destroy
// - GET    EditURI (/atom/edit/XXXXXXXXXXXXXX) => Fotolife#show
// - GET    FeedURI (/atom/feed)                => Fotolife#index
class Fotolife {
  private static BASE_URL = 'http://f.hatena.ne.jp';
  private _type: 'oauth' | 'wsse';
  private _username: string | null;
  private _apikey: string | null;
  private _consumerKey: string | null;
  private _consumerSecret: string | null;
  private _accessToken: string | null;
  private _accessTokenSecret: string | null;

  constructor(arg: FotolifeOptions) {
    this._type = arg.type != null ? arg.type : 'wsse';
    if (arg.type === 'oauth') {
      this._username = null;
      this._apikey = null;
      this._consumerKey = arg.consumerKey;
      this._consumerSecret = arg.consumerSecret;
      this._accessToken = arg.accessToken;
      this._accessTokenSecret = arg.accessTokenSecret;
    } else {
      this._username = arg.username;
      this._apikey = arg.apikey;
    }
  }

  // POST PostURI (/atom/post)
  public create(
    arg: {
      file: string; // 'content'. image file path. (required)
      title?: string; // 'title'. image title. default `''`.
      type?: string; // 'type'. content-type. default `mime.lookup(file)`.
      folder?: string; // 'dc:subject'. folder name. default `undefined`.
      generator?: string; // 'generator'. tool name. default `undefined`.
    },
    callback?: Callback<T>
  ): Promise<T> {
    const file = arg.file;
    const folder = arg.folder;
    const generator = arg.generator;
    if (file == null)
      return this._reject('options.file is required', callback);
    if (!fs.existsSync(file))
      return this._reject('options.file does not exist', callback);
    const title = arg.title != null ? arg.title : '';
    const type = arg.type != null ? arg.type : mime.lookup(file);
    const encoded = fs.readFileSync(file).toString('base64');
    const method = 'post';
    const path = '/atom/post';
    const body: XMLObject = {
      entry: {
        $: {
          xmlns: 'http://purl.org/atom/ns#'
        },
        content: {
          $: {
            mode: 'base64',
            type
          },
          _: encoded
        },
        title: {
          _: title
        }
      }
    };
    if (folder != null)
      body.entry['dc:subject'] = {
        _: folder
      };
    if (generator != null)
      body.entry.generator = {
        _: generator
      };
    const statusCode = 201;
    return this._request({ body, method, path, statusCode }, callback);
  }

  // PUT EditURI (/atom/edit/XXXXXXXXXXXXXX)
  public update(
    arg: {
      id: string; // image id. (required)
      title: string; // 'title'. image title. (required)
    },
    callback: Callback<T>
  ): Promise<T> {
    const id = arg.id;
    const title = arg.title;
    if (id == null)
      return this._reject('options.id is required', callback);
    if (title == null)
      return this._reject('options.title is required', callback);
    const method = 'put';
    const path = '/atom/edit/' + id;
    const body = {
      entry: {
        $: {
          xmlns: 'http://purl.org/atom/ns#'
        },
        title: {
          _: title
        }
      }
    };
    const statusCode = 200;
    return this._request({ body, method, path, statusCode }, callback);
  }

  // DELETE EditURI (/atom/edit/XXXXXXXXXXXXXX)
  public destroy(
    arg: {
      id: string; // image id. (required)
    },
    callback: Callback<T>
  ): Promise<T> {
    const id = arg.id;
    if (id == null)
      return this._reject('options.id is required', callback);
    const method = 'delete';
    const path = '/atom/edit/' + id;
    const statusCode = 200;
    return this._request({ method, path, statusCode }, callback);
  }

  // GET EditURI (/atom/edit/XXXXXXXXXXXXXX)
  public show(
    arg: {
      id: string; // image id. (required)
    },
    callback: Callback<T>
  ): Promise<T> {
    const id = arg.id;
    if (id == null)
      return this._reject('options.id is required', callback);
    const method = 'get';
    const path = '/atom/edit/' + id;
    const statusCode = 200;
    return this._request({ method, path, statusCode }, callback);
  }

  // GET FeedURI (/atom/feed)
  public index(options: {}, callback: Callback<T>): Promise<T> {
    if (callback == null)
      callback = options;
    const method = 'get';
    const path = '/atom/feed';
    const statusCode = 200;
    return this._request({ method, path, statusCode }, callback);
  }

  private _reject(message: string, callback: Callback<T>): Promise<T> {
    var e;
    try {
      e = new Error(message);
      if (callback != null)
        callback(e);
      return Promise.reject(e);
    } catch (error) {
      return Promise.reject(e);
    }
  }

  private _request(
    arg: {
      body?: XMLObject;
      method: 'delete' | 'get' | 'post' | 'put';
      path: string;
      statusCode: number;
    },
    callback: Callback<T>
  ): Promise<T> {
    const method = arg.method;
    const path = arg.path;
    const body = arg.body;
    const statusCode = arg.statusCode;
    callback = callback != null ? callback : () => void 0;
    const params: any = {};
    params.method = method;
    params.url = Fotolife.BASE_URL + path;
    if (this._type === 'oauth')
      params.oauth = {
        consumer_key: this._consumerKey,
        consumer_secret: this._consumerSecret,
        token: this._accessToken,
        token_secret: this._accessTokenSecret
      };
    else { // this._type === 'wsse'
      const token = wsse().getUsernameToken(this._username, this._apikey, {
        nonceBase64: true
      });
      params.headers = {
        'Authorization': 'WSSE profile="UsernameToken"',
        'X-WSSE': 'UsernameToken ' + token
      };
    }
    const promise: Promise<string | null> =
      body != null ? this._toXml(body) : Promise.resolve(null);
    return promise.then((b) => {
      if (b != null)
        params.body = b;
      return this._requestPromise(params);
    }).then((res) => {
      if (res.statusCode !== statusCode)
        throw new Error('HTTP status code is ' + res.statusCode);
      return this._toJson(res.body);
    }).then((json) => {
      callback(null, json);
      return json;
    }).then(null, (err) => {
      callback(err);
      throw err;
    });
  }

  private _requestPromise(
    params: any
  ): Promise<request.Response> {
    return new Promise((resolve, reject) => {
      return request(params, (err, res) => {
        if (err != null)
          return reject(err);
        else
          return resolve(res);
      });
    });
  }

  private _toJson(xml: string): Promise<XMLObject> {
    return new Promise((resolve, reject) => {
      const parser = new xml2js.Parser({
        explicitArray: false,
        explicitCharkey: true
      });
      return parser.parseString(xml, (err, result) => {
        if (err != null)
          return reject(err);
        else
          return resolve(result);
      });
    });
  }

  private _toXml(json: XMLObject): Promise<string> {
    const builder = new xml2js.Builder();
    try {
      const xml = builder.buildObject(json);
      return Promise.resolve(xml);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export { Fotolife };
