import fs from "fs";
import mime from "mime";
import request from "request";
import wsse from "wsse";
import xml2js from "xml2js";

type FotolifeOptions = FotolifeOptionsOAuth | FotolifeOptionsWSSE;

interface FotolifeOptionsOAuth {
  accessToken: string;
  accessTokenSecret: string;
  consumerKey: string;
  consumerSecret: string;
  type: "oauth";
}

interface FotolifeOptionsWSSE {
  apikey: string;
  type?: "wsse";
  username: string;
}

type XMLObject = any;

const rejectE = (s: string): Promise<never> => Promise.reject(new Error(s));

const requestPromise = (
  params: request.UrlOptions & request.CoreOptions
): Promise<request.Response> => {
  return new Promise((resolve, reject) => {
    return request(params, (error, response) => {
      if (error !== null) return reject(error);
      else return resolve(response);
    });
  });
};

const xmlStringToObject = (xmlString: string): Promise<XMLObject> => {
  return new Promise((resolve, reject) => {
    const parser = new xml2js.Parser({
      explicitArray: false,
      explicitCharkey: true,
    });
    return parser.parseString(xmlString, (error: Error | null, result: any) => {
      if (error !== null) return reject(error);
      else return resolve(result);
    });
  });
};

const xmlObjectToXmlString = (xmlObject: XMLObject): Promise<string> => {
  try {
    const builder = new xml2js.Builder();
    const xmlString = builder.buildObject(xmlObject);
    return Promise.resolve(xmlString);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Hatena::Fotolife API wrapper
//
// - POST   PostURI (/atom/post)                => Fotolife#create
// - PUT    EditURI (/atom/edit/XXXXXXXXXXXXXX) => Fotolife#update
// - DELETE EditURI (/atom/edit/XXXXXXXXXXXXXX) => Fotolife#destroy
// - GET    EditURI (/atom/edit/XXXXXXXXXXXXXX) => Fotolife#show
// - GET    FeedURI (/atom/feed)                => Fotolife#index
class Fotolife {
  private static BASE_URL = "https://f.hatena.ne.jp";
  private _type: "oauth" | "wsse";
  private _username: string | null;
  private _apikey: string | null;
  private _consumerKey: string | null;
  private _consumerSecret: string | null;
  private _accessToken: string | null;
  private _accessTokenSecret: string | null;

  constructor(options: FotolifeOptions) {
    this._type = typeof options.type !== "undefined" ? options.type : "wsse";
    if (options.type === "oauth") {
      this._username = null;
      this._apikey = null;
      this._consumerKey = options.consumerKey;
      this._consumerSecret = options.consumerSecret;
      this._accessToken = options.accessToken;
      this._accessTokenSecret = options.accessTokenSecret;
    } else {
      this._username = options.username;
      this._apikey = options.apikey;
      this._consumerKey = null;
      this._consumerSecret = null;
      this._accessToken = null;
      this._accessTokenSecret = null;
    }
  }

  // POST PostURI (/atom/post)
  public create({
    file,
    folder: folderOrUndefined,
    generator: generatorOrUndefined,
    title: titleOrUndefined,
    type: typeOrUndefined,
  }: {
    file: string; // 'content'. image file path. (required)
    folder?: string; // 'dc:subject'. folder name. default `undefined`.
    generator?: string; // 'generator'. tool name. default `undefined`.
    title?: string; // 'title'. image title. default `''`.
    type?: string; // 'type'. content-type. default `mime.lookup(file)`.
  }): Promise<any> {
    // FIXME
    if (!fs.existsSync(file)) return rejectE("options.file does not exist");
    return this._request({
      body: {
        entry: {
          $: {
            xmlns: "http://purl.org/atom/ns#",
          },
          content: {
            $: {
              mode: "base64",
              type:
                typeof typeOrUndefined !== "undefined"
                  ? typeOrUndefined
                  : mime.getType(file),
            },
            _: fs.readFileSync(file).toString("base64"),
          },
          title: {
            _: typeof titleOrUndefined !== "undefined" ? titleOrUndefined : "",
          },
          ...(typeof folderOrUndefined !== "undefined"
            ? { "dc:subject": { _: folderOrUndefined } }
            : {}),
          ...(typeof generatorOrUndefined !== "undefined"
            ? { generator: { _: generatorOrUndefined } }
            : {}),
        },
      },
      method: "post",
      path: "/atom/post",
      statusCode: 201,
    });
  }

  // PUT EditURI (/atom/edit/XXXXXXXXXXXXXX)
  public update({
    id,
    title,
  }: {
    id: number; // image id. (required)
    title: string; // 'title'. image title. (required)
  }): Promise<any> {
    // FIXME
    return this._request({
      body: {
        entry: {
          $: {
            xmlns: "http://purl.org/atom/ns#",
          },
          title: {
            _: title,
          },
        },
      },
      method: "put",
      path: "/atom/edit/" + id,
      statusCode: 200,
    });
  }

  // DELETE EditURI (/atom/edit/XXXXXXXXXXXXXX)
  public destroy({
    id,
  }: {
    id: number; // image id. (required)
  }): Promise<any> {
    // FIXME
    return this._request({
      method: "delete",
      path: "/atom/edit/" + id,
      statusCode: 200,
    });
  }

  // GET EditURI (/atom/edit/XXXXXXXXXXXXXX)
  public show({
    id,
  }: {
    id: number; // image id. (required)
  }): Promise<any> {
    // FIXME
    return this._request({
      method: "get",
      path: "/atom/edit/" + id,
      statusCode: 200,
    });
  }

  // GET FeedURI (/atom/feed)
  public index(): Promise<any> {
    // FIXME
    return this._request({
      method: "get",
      path: "/atom/feed",
      statusCode: 200,
    });
  }

  private _request<T>({
    body,
    method,
    path,
    statusCode,
  }: {
    body?: XMLObject;
    method: "delete" | "get" | "post" | "put";
    path: string;
    statusCode: number;
  }): Promise<T> {
    const bodyOrNullPromise: Promise<string | null> =
      typeof body !== "undefined"
        ? xmlObjectToXmlString(body)
        : Promise.resolve(null);
    return bodyOrNullPromise
      .then((bodyOrNull: string | null) => {
        return requestPromise({
          ...(bodyOrNull !== null ? { body: bodyOrNull } : {}),
          ...(this._type !== "oauth"
            ? {
                headers: {
                  Authorization: 'WSSE profile="UsernameToken"',
                  "X-WSSE": wsse({
                    password: this._apikey!,
                    username: this._username!,
                  }).getWSSEHeader({ nonceBase64: true }),
                },
              }
            : {}),
          method,
          ...(this._type === "oauth"
            ? {
                oauth: {
                  consumer_key: this._consumerKey!,
                  consumer_secret: this._consumerSecret!,
                  token: this._accessToken!,
                  token_secret: this._accessTokenSecret!,
                },
              }
            : {}),
          url: Fotolife.BASE_URL + path,
        });
      })
      .then((res) => {
        if (res.statusCode !== statusCode)
          throw new Error("HTTP status code is " + res.statusCode);
        return xmlStringToObject(res.body);
      });
  }
}

export { Fotolife, FotolifeOptions };
