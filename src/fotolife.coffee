fs = require 'fs'
mime = require 'mime'
request = require 'request'
wsse = require 'wsse'
xml2js = require 'xml2js'
{Promise} = require 'q'

# Hatena::Fotolife API wrapper
#
# - POST   PostURI (/atom/post)                => Fotolife#create
# - PUT    EditURI (/atom/edit/XXXXXXXXXXXXXX) => Fotolife#update
# - DELETE EditURI (/atom/edit/XXXXXXXXXXXXXX) => Fotolife#destroy
# - GET    EditURI (/atom/edit/XXXXXXXXXXXXXX) => Fotolife#show
# - GET    FeedURI (/atom/feed)                => Fotolife#index
class Fotolife

  @BASE_URL = 'http://f.hatena.ne.jp'

  # constructor
  # params:
  #   options: (required)
  #   - type     : authentication type. default `'wsse'`
  #   - username : wsse authentication username. (required)
  #   - apikey   : wsse authentication apikey. (required)
  constructor: ({ type, username, apikey }) ->
    @_type = type ? 'wsse'
    @_username = username
    @_apikey = apikey
    @_wsse = wsse()

  # POST PostURI (/atom/post)
  # params:
  #   options: (required)
  #   - file     : 'content'. image file path. (required)
  #   - title    : 'title'. image title. default `''`.
  #   - type     : 'type'. content-type. default `mime.lookup(file)`.
  #   - folder   : 'dc:subject'. folder name. default `undefined`.
  #   - generator: 'generator'. tool name. default `undefined`.
  #   callback:
  #   - err: error
  #   - res: response
  # returns:
  #   Promise
  create: ({ file, title, type, folder, generator }, callback) ->
    return @_reject('options.file is required', callback) unless file?
    title = title ? ''
    type = type ? mime.lookup(file)
    encoded = fs.readFileSync(file).toString('base64')
    # params
    method = 'post'
    path = '/atom/post'
    body = entry:
      $:
        xmlns: 'http://purl.org/atom/ns#'
      title:
        _: title
      content:
        $:
          mode: 'base64'
          type: type
        _: encoded
    body.entry['dc:subject'] = { _: folder } if folder?
    body.entry.generator = { _: generator } if generator?
    # TODO: check res.statusCode is 201
    @_request { method, path, body }, callback

  # PUT EditURI (/atom/edit/XXXXXXXXXXXXXX)
  # params:
  #   options: (required)
  #   - id    : image id. (required)
  #   - title : 'title'. image title. (required)
  #   callback:
  #   - err: error
  #   - res: feed
  # returns:
  #   Promise
  update: ({ id, title }, callback) ->
    return @_reject('options.id is required', callback) unless id?
    return @_reject('options.title is required', callback) unless title?
    method = 'put'
    path = '/atom/edit/' + id
    body =
      entry:
        $:
          xmlns: 'http://purl.org/atom/ns#'
        title:
          _: title
    # TODO: check res.statusCode is 200
    @_request { method, path, body }, callback

  # DELETE EditURI (/atom/edit/XXXXXXXXXXXXXX)
  # params:
  #   options: (required)
  #   - id: image id. (required)
  #   callback:
  #   - err: error
  #   - res: response
  # returns:
  #   Promise
  destroy: ({ id }, callback) ->
    return @_reject('options.id is required', callback) unless id?
    method = 'delete'
    path = '/atom/edit/' + id
    # TODO: check res.statusCode is 200
    @_request { method, path }, callback

  # GET EditURI (/atom/edit/XXXXXXXXXXXXXX)
  # params:
  #   options: (required)
  #   - id: image id. (required)
  #   callback:
  #   - err: error
  #   - res: response
  # returns:
  #   Promise
  show: ({ id }, callback) ->
    return @_reject('options.id is required', callback) unless id?
    method = 'get'
    path = '/atom/edit/' + id
    # TODO: check res.statusCode is 200
    @_request { method, path }, callback

  # GET FeedURI (/atom/feed)
  # params:
  #   options:
  #   callback:
  #   - err: error
  #   - res: response
  # returns:
  #   Promise
  index: (options, callback) ->
    callback = options unless callback?
    method = 'get'
    path = '/atom/feed'
    # TODO: check res.statusCode is 200
    @_request { method, path }, callback

  _reject: (message, callback) ->
    try
      e = new Error(message)
      callback(e) if callback?
    finally
      Promise.reject(e)

  _request: ({ method, path, body }, callback) ->
    callback = callback ? (->)
    token = @_wsse.getUsernameToken @_username, @_apikey, nonceBase64: true
    params = {}
    params.method = method
    params.url = Fotolife.BASE_URL + path
    params.headers =
      'Authorization': 'WSSE profile="UsernameToken"',
      'X-WSSE': 'UsernameToken ' + token
    promise = if body? then @_toXml(body) else Promise.resolve(null)
    promise
      .then (body) =>
        params.body = body if body?
        @_requestPromise params
      .then (res) =>
        @_toJson res.body
      .then (json) ->
        callback(null, json)
        json
      .then null, (err) ->
        callback(err)
        err

  _requestPromise: (params) ->
    new Promise (resolve, reject) ->
      request params, (err, res) ->
        if err?
          reject err
        else
          resolve res

  _toJson: (xml) ->
    new Promise (resolve, reject) ->
      parser = new xml2js.Parser explicitArray: false, explicitCharkey: true
      parser.parseString xml, (err, result) ->
        if err?
          reject err
        else
          resolve result

  _toXml: (json) ->
    builder = new xml2js.Builder()
    xml = builder.buildObject json
    Promise.resolve xml

module.exports = Fotolife
