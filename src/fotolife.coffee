fs = require 'fs'
request = require 'request'
wsse = require 'wsse'
xml2js = require 'xml2js'
mime = require 'mime'

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
  # - file: image file path (required)
  # - title: image title (optional)
  # - type: content-type (optional)
  # - dc:subject: folder name TODO
  # - generator: tool name TODO
  # callback:
  # - err: error
  # - res: response
  create: (options, callback) ->
    # TODO: check required properties
    method = 'post'
    path = '/atom/post'
    title = options.title ? ''
    type = options.type ? mime(options.file)
    encoded = fs.readFileSync(options.file).toString('base64')
    # TODO: XML encode
    body = """
      <entry xmlns="http://purl.org/atom/ns#">
        <title>#{title}</title>
        <content mode="base64" type="#{type}">#{encoded}</content>
      </entry>
    """
    # TODO: check res.statusCode is 201
    @_request { method, path, body }, callback

  # PUT EditURI (/atom/edit/XXXXXXXXXXXXXX)
  # options:
  # - id: XXXXXXXXXXXXXX
  # - title: title
  # callback:
  # - err: error
  # - res: response
  update: (options, callback) ->
    # TODO: check required properties
    method = 'post'
    path = '/atom/edit/' + options.id
    title = options.title
    # TODO: XML encode
    body = """
      <entry xmlns="http://purl.org/atom/ns#">
        <title>#{title}</title>
      </entry>
    """
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
    delete options.path
    request options, (err, res) ->
      return callback(err) if err?
      parser = new xml2js.Parser()
      parser.parseString res.body, (err, result) ->
        return callback(err) if err?
        callback null, result

module.exports = Fotolife
