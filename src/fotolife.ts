
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

const rejectE = (s: string): Promise<never> => Promise.reject(new Error(s));

const requestPromise = (
  params: request.UrlOptions & request.CoreOptions
): Promise<request.Response> => {
  return new Promise((resolve, reject) => {
    return request(params, (error, response) => {
      if (error !== null)
        return reject(error);
      else
        return resolve(response);
    });
  });
};

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

  constructor(options: FotolifeOptions) {
    this._type = typeof options.type !== 'undefined' ? options.type : 'wsse';
    if (options.type === 'oauth') {
      this._username = null;
      this._apikey = null;
      this._consumerKey = options.consumerKey;
      this._consumerSecret = options.consumerSecret;
      this._accessToken = options.accessToken;
      this._accessTokenSecret = options.accessTokenSecret;
    } else {
      this._username = options.username;
      this._apikey = options.apikey;
    }
  }

  // POST PostURI (/atom/post)
  public create(
    {
      file,
      folder: folderOrUndefined,
      generator: generatorOrUndefined,
      title: titleOrUndefined,
      type: typeOrUndefined
    }: {
      file: string; // 'content'. image file path. (required)
      folder?: string; // 'dc:subject'. folder name. default `undefined`.
      generator?: string; // 'generator'. tool name. default `undefined`.
      title?: string; // 'title'. image title. default `''`.
      type?: string; // 'type'. content-type. default `mime.lookup(file)`.
    }
  ): Promise<T> {
    if (!fs.existsSync(file)) return rejectE('options.file does not exist');
    const title = typeof titleOrUndefined !== 'undefined'
      ? titleOrUndefined : '';
    const type = typeof typeOrUndefined !== 'undefined'
      ? typeOrUndefined : mime.lookup(file);
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
    if (typeof folderOrUndefined !== 'undefined')
      body.entry['dc:subject'] = {
        _: folderOrUndefined
      };
    if (typeof generatorOrUndefined !== 'undefined')
      body.entry.generator = {
        _: generatorOrUndefined
      };
    const statusCode = 201;
    return this._request({ body, method, path, statusCode });
  }

  // PUT EditURI (/atom/edit/XXXXXXXXXXXXXX)
  public update(
    { id, title }: {
      id: string; // image id. (required)
      title: string; // 'title'. image title. (required)
    }
  ): Promise<T> {
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
    return this._request({ body, method, path, statusCode });
  }

  // DELETE EditURI (/atom/edit/XXXXXXXXXXXXXX)
  public destroy(
    { id }: {
      id: string; // image id. (required)
    }
  ): Promise<T> {
    const method = 'delete';
    const path = '/atom/edit/' + id;
    const statusCode = 200;
    return this._request({ method, path, statusCode });
  }

  // GET EditURI (/atom/edit/XXXXXXXXXXXXXX)
  public show(
    { id }: {
      id: string; // image id. (required)
    }
  ): Promise<T> {
    const method = 'get';
    const path = '/atom/edit/' + id;
    const statusCode = 200;
    return this._request({ method, path, statusCode });
  }

  // GET FeedURI (/atom/feed)
  public index(): Promise<T> {
    const method = 'get';
    const path = '/atom/feed';
    const statusCode = 200;
    return this._request({ method, path, statusCode });
  }

  private _request(
    arg: {
      body?: XMLObject;
      method: 'delete' | 'get' | 'post' | 'put';
      path: string;
      statusCode: number;
    }
  ): Promise<T> {
    const method = arg.method;
    const path = arg.path;
    const body = arg.body;
    const statusCode = arg.statusCode;
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
      typeof body !== 'undefined' ? this._toXml(body) : Promise.resolve(null);
    return promise.then((b) => {
      if (b !== null)
        params.body = b;
      return requestPromise(params);
    }).then((res) => {
      if (res.statusCode !== statusCode)
        throw new Error('HTTP status code is ' + res.statusCode);
      return this._toJson(res.body);
    });
  }

  private _toJson(xml: string): Promise<XMLObject> {
    return new Promise((resolve, reject) => {
      const parser = new xml2js.Parser({
        explicitArray: false,
        explicitCharkey: true
      });
      return parser.parseString(xml, (error, result) => {
        if (error !== null)
          return reject(error);
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
