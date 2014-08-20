fs = require 'fs'
mime = require 'mime'
request = require 'request'
wsse = require 'wsse'
xml2js = require 'xml2js'

# - POST   PostURI (/atom/post)                => Fotolife#create
# - PUT    EditURI (/atom/edit/XXXXXXXXXXXXXX) => Fotolife#update
# - DELETE EditURI (/atom/edit/XXXXXXXXXXXXXX) => Fotolife#destroy
# - GET    EditURI (/atom/edit/XXXXXXXXXXXXXX) => Fotolife#show
# - GET    FeedURI (/atom/feed)                => Fotolife#index
class Fotolife

  @BASE_URL = 'http://f.hatena.ne.jp'

  constructor: (options) ->
    @_type = options.type
    @_username = options.username
    @_apikey = options.apikey
    @_wsse = wsse()

  # POST PostURI (/atom/post)
  # options:
  # - file     : 'content'. image file path. (required)
  # - title    : 'title'. image title. default `''`. (optional)
  # - type     : 'type'. content-type. default `mime.lookup(file)`. (optional)
  # - folder   : 'dc:subject'. folder name. default `undefined`. (optional)
  # - generator: 'generator'. tool name. default `undefined`. (optional)
  # callback:
  # - err: error
  # - res: response
  create: ({ file, title, type, folder, generator }, callback) ->
    return callback(new Error('options.file is required')) unless file?
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
  # options:
  # - id    : image id. (required)
  # - title : 'title'. image title. (required)
  # callback:
  # - err: error
  # - res: response
  update: ({ id, title }, callback) ->
    return callback(new Error('options.id is required')) unless id?
    return callback(new Error('options.title is required')) unless title?
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
  # options:
  # - id: XXXXXXXXXXXXXX
  # callback:
  # - err: error
  # - res: response
  destroy: (options, callback) ->
    # TODO: check required properties
    method = 'delete'
    path = '/atom/edit/' + options.id
    # TODO: check res.statusCode is 200
    @_request { method, path }, callback

  # GET EditURI (/atom/edit/XXXXXXXXXXXXXX)
  # options:
  # - id: XXXXXXXXXXXXXX
  # callback:
  # - err: error
  # - res: response
  show: (options, callback) ->
    # TODO: check required properties
    method = 'get'
    path = '/atom/edit/' + options.id
    # TODO: check res.statusCode is 200
    @_request { method, path }, callback

  # GET FeedURI (/atom/feed)
  index: (options, callback) ->
    callback = options unless callback?
    method = 'get'
    path = '/atom/feed'
    # TODO: check res.statusCode is 200
    @_request { method, path }, callback

  _request: (options, callback) ->
    token = @_wsse.getUsernameToken @_username, @_apikey, nonceBase64: true
    options.url = Fotolife.BASE_URL + options.path
    options.headers =
      'Authorization': 'WSSE profile="UsernameToken"',
      'X-WSSE': 'UsernameToken ' + token
    options.body = @_toXml(options.body) if options.body?
    delete options.path
    request options, (err, res) ->
      return callback(err) if err?
      parser = new xml2js.Parser()
      parser.parseString res.body, (err, result) ->
        return callback(err) if err?
        callback null, result

  _toXml: (json) ->
    builder = new xml2js.Builder()
    builder.buildObject json

module.exports = Fotolife
