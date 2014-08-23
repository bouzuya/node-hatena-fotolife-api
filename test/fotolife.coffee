assert = require 'power-assert'
path = require 'path'
sinon = require 'sinon'

Fotolife = require '../src/fotolife'

describe 'fotolife', ->
  beforeEach ->
    @sinon = sinon.sandbox.create()

  afterEach ->
    @sinon.restore()

  describe 'constructor', ->
    describe 'use wsse', ->
      beforeEach ->
        @fotolife = new Fotolife
          username: 'username'
          apikey: 'apikey'

      it 'works', ->
        assert @fotolife._type is 'wsse'
        assert @fotolife._username is 'username'
        assert @fotolife._apikey is 'apikey'

    describe 'use oauth', ->
      beforeEach ->
        @fotolife = new Fotolife
          type: 'oauth'
          consumerKey: 'consumerKey'
          consumerSecret: 'consumerSecret'
          accessToken: 'accessToken'
          accessTokenSecret: 'accessTokenSecret'

      it 'works', ->
        assert @fotolife._type is 'oauth'
        assert @fotolife._consumerKey is 'consumerKey'
        assert @fotolife._consumerSecret is 'consumerSecret'
        assert @fotolife._accessToken is 'accessToken'
        assert @fotolife._accessTokenSecret is 'accessTokenSecret'

  describe 'create', ->
    beforeEach ->
      @request = @sinon.stub Fotolife.prototype, '_request', -> null
      @fotolife = new Fotolife
        type: 'wsse'
        username: 'username'
        apikey: 'apikey'

    describe 'no file options', ->
      describe 'callback style', ->
        describe 'normal case', ->
          it 'calls callback with error', (done) ->
            @fotolife.create {}, (e) =>
              assert @request.callCount is 0
              assert e instanceof Error
              done()

        describe 'callback throws error', ->
          it 'returns promise', ->
            promise = @fotolife.create {}, -> throw new Error()
            assert promise.then?

      describe 'promise style', ->
        it 'calls onError', (done) ->
          @fotolife
            .create {}
            .then null, (e) =>
              assert @request.callCount is 0
              assert e instanceof Error
            .then (-> done()), done

    describe 'file not exists', ->
      it 'calls callback with error', (done) ->
        @fotolife.create { file: 'noexists'}, (e) =>
          assert @request.callCount is 0
          assert e instanceof Error
          done()

    describe 'default options', ->
      it 'works', ->
        pngfile = path.resolve __dirname, './bouzuya.png'
        @fotolife.create
          file: pngfile
        , -> null
        assert @request.firstCall.args[0].method is 'post'
        assert @request.firstCall.args[0].path is '/atom/post'
        body = @request.firstCall.args[0].body
        assert body.entry.title._ is ''
        assert body.entry.content.$.type is 'image/png'
        assert body.entry['dc:subject'] is undefined
        assert body.entry.generator is undefined

    describe 'all options', ->
      it 'works', ->
        pngfile = path.resolve __dirname, './bouzuya.png'
        @fotolife.create
          file: pngfile
          title: 'TITLE'
          type: 'TYPE'
          folder: 'FOLDER'
          generator: 'GENERATOR'
        , -> null
        assert @request.firstCall.args[0].method is 'post'
        assert @request.firstCall.args[0].path is '/atom/post'
        body = @request.firstCall.args[0].body
        assert body.entry.title._ is 'TITLE'
        assert body.entry.content.$.type is 'TYPE'
        assert body.entry['dc:subject']._ is 'FOLDER'
        assert body.entry.generator._ is 'GENERATOR'

  describe 'update', ->
    beforeEach ->
      @request = @sinon.stub Fotolife.prototype, '_request', -> null
      @fotolife = new Fotolife
        type: 'wsse'
        username: 'username'
        apikey: 'apikey'

    describe 'no id options', ->
      it 'calls callback with error', (done) ->
        @fotolife.update {}, (e) =>
          assert @request.callCount is 0
          assert e instanceof Error
          done()

    describe 'no title options', ->
      it 'calls callback with error', (done) ->
        @fotolife.update { id: 123 }, (e) =>
          assert @request.callCount is 0
          assert e instanceof Error
          done()

    describe 'all options', ->
      it 'works', ->
        @fotolife.update { id: 123, title: 'TITLE' }, -> null
        assert @request.firstCall.args[0].method is 'put'
        assert @request.firstCall.args[0].path is '/atom/edit/123'
        body = @request.firstCall.args[0].body
        assert body.entry.title._ is 'TITLE'

  describe 'destroy', ->
    beforeEach ->
      @request = @sinon.stub Fotolife.prototype, '_request', -> null
      @fotolife = new Fotolife
        type: 'wsse'
        username: 'username'
        apikey: 'apikey'

    describe 'no id options', ->
      it 'calls callback with error', (done) ->
        @fotolife.destroy {}, (e) =>
          assert @request.callCount is 0
          assert e instanceof Error
          done()

    describe 'all options', ->
      it 'works', ->
        @fotolife.destroy { id: 123 }, -> null
        assert @request.firstCall.args[0].method is 'delete'
        assert @request.firstCall.args[0].path is '/atom/edit/123'

  describe 'show', ->
    beforeEach ->
      @request = @sinon.stub Fotolife.prototype, '_request', -> null
      @fotolife = new Fotolife
        type: 'wsse'
        username: 'username'
        apikey: 'apikey'

    describe 'no id options', ->
      it 'calls callback with error', (done) ->
        @fotolife.show {}, (e) =>
          assert @request.callCount is 0
          assert e instanceof Error
          done()

    describe 'all options', ->
      it 'works', ->
        @fotolife.show { id: 123 }, -> null
        assert @request.firstCall.args[0].method is 'get'
        assert @request.firstCall.args[0].path is '/atom/edit/123'

  describe 'index', ->
    beforeEach ->
      @request = @sinon.stub Fotolife.prototype, '_request', -> null
      @fotolife = new Fotolife
        type: 'wsse'
        username: 'username'
        apikey: 'apikey'

    describe 'all options', ->
      it 'works', ->
        @fotolife.index {}, -> null
        assert @request.firstCall.args[0].method is 'get'
        assert @request.firstCall.args[0].path is '/atom/feed'

    describe 'callback only', ->
      it 'works', ->
        @fotolife.index -> null
        assert @request.firstCall.args[0].method is 'get'
        assert @request.firstCall.args[0].path is '/atom/feed'

  describe '_request', ->
    describe 'request succeed', ->
      beforeEach ->
        @request = @sinon.stub Fotolife.prototype, '_requestPromise', ->
          then: (onFulFilled) -> onFulFilled(body: '', statusCode: 200)

      describe 'wsse auth', ->
        beforeEach ->
          @fotolife = new Fotolife
            type: 'wsse'
            username: 'username'
            apikey: 'apikey'

        describe 'callback style', ->
          it 'works', (done) ->
            @fotolife._request {
              method: 'METHOD',
              path: 'PATH',
              body:
                feed:
                  _: 'test'
              statusCode: 200
            }, (err, res) =>
              try
                args = @request.firstCall.args
                assert args[0].method is 'METHOD'
                assert args[0].url is 'http://f.hatena.ne.jpPATH'
                assert args[0].headers.Authorization?
                assert args[0].headers['X-WSSE']?
              catch e
                done(e)
              done(err)

        describe 'promise style', ->
          describe 'normal case', ->
            it 'works', (done) ->
              @fotolife._request {
                method: 'METHOD'
                path: 'PATH'
                statusCode: 200
              }
                .then =>
                  args = @request.firstCall.args
                  assert args[0].method is 'METHOD'
                  assert args[0].url is 'http://f.hatena.ne.jpPATH'
                  assert args[0].headers.Authorization?
                  assert args[0].headers['X-WSSE']?
                .then (-> done()), done

          describe 'invalid status code', ->
            it 'works', (done) ->
              @fotolife._request {
                method: 'METHOD'
                path: 'PATH'
                statusCode: 201
              }
                .then null, (e) ->
                  assert e instanceof Error
                .then (-> done()), done

      describe 'oauth auth', ->
        beforeEach ->
          @fotolife = new Fotolife
            type: 'oauth'
            consumerKey: 'CONSUMER_KEY'
            consumerSecret: 'CONSUMER_SECRET'
            accessToken: 'ACCESS_TOKEN'
            accessTokenSecret: 'ACCESS_TOKEN_SECRET'

        describe 'callback style', ->
          it 'works', (done) ->
            @fotolife._request {
              method: 'METHOD'
              path: 'PATH'
              statusCode: 200
            }, (err, res) =>
              args = @request.firstCall.args
              assert args[0].method is 'METHOD'
              assert args[0].url is 'http://f.hatena.ne.jpPATH'
              assert args[0].oauth.consumer_key is 'CONSUMER_KEY'
              assert args[0].oauth.consumer_secret is 'CONSUMER_SECRET'
              assert args[0].oauth.token is 'ACCESS_TOKEN'
              assert args[0].oauth.token_secret is 'ACCESS_TOKEN_SECRET'
              done(err)

        describe 'promise style', ->
          it 'works', (done) ->
            @fotolife._request {
              method: 'METHOD'
              path: 'PATH'
              statusCode: 200
            }
              .then =>
                args = @request.firstCall.args
                assert args[0].method is 'METHOD'
                assert args[0].url is 'http://f.hatena.ne.jpPATH'
                assert args[0].oauth.consumer_key is 'CONSUMER_KEY'
                assert args[0].oauth.consumer_secret is 'CONSUMER_SECRET'
                assert args[0].oauth.token is 'ACCESS_TOKEN'
                assert args[0].oauth.token_secret is 'ACCESS_TOKEN_SECRET'
              .then (-> done()), done

    describe 'request failure', ->
      beforeEach ->
        @request = @sinon.stub Fotolife.prototype, '_requestPromise', ->
          then: (_, onError) -> onError(new Error())

      describe 'wsse auth', ->
        beforeEach ->
          @fotolife = new Fotolife
            type: 'wsse'
            username: 'username'
            apikey: 'apikey'

        describe 'callback style', ->
          it 'works', (done) ->
            @fotolife._request { method: 'METHOD', path: 'PATH' }, (err) ->
              assert err instanceof Error
              done()

        describe 'promise style', ->
          it 'works', (done) ->
            @fotolife._request(method: 'METHOD', path: 'PATH')
              .then null, (e) ->
                assert e instanceof Error
              .then (-> done()), done

      describe 'oauth auth', ->
        beforeEach ->
          @fotolife = new Fotolife
            type: 'oauth'
            consumerKey: 'CONSUMER_KEY'
            consumerSecret: 'CONSUMER_SECRET'
            accessToken: 'ACCESS_TOKEN'
            accessTokenSecret: 'ACCESS_TOKEN_SECRET'

        describe 'callback style', ->
          it 'works', (done) ->
            @fotolife._request { method: 'METHOD', path: 'PATH' }, (err) ->
              assert err instanceof Error
              done()

        describe 'promise style', ->
          it 'works', (done) ->
            @fotolife._request(method: 'METHOD', path: 'PATH')
              .then null, (e) ->
                assert e instanceof Error
              .then (-> done()), done

  describe '_requestPromise', ->
    describe 'request succeed', ->
      it 'works', (done) ->
        params = { a: 'a', b: 1 }
        @request = @sinon.stub Fotolife.prototype, '_rawRequest', (_, cb) ->
          cb(null)
        promise = Fotolife.prototype._requestPromise params
        promise.then (-> done()), done

    describe 'request failure', ->
      it 'works', (done) ->
        params = { a: 'a', b: 1 }
        @request = @sinon.stub Fotolife.prototype, '_rawRequest', (_, cb) ->
          cb(new Error())
        promise = Fotolife.prototype._requestPromise params
        promise
          .then null, (e) ->
            assert e instanceof Error
          .then (-> done()), done

  describe '_toJson / _toXml', ->
    describe 'invalid elements', ->
      describe '_toJson', ->
        it 'works', (done) ->
          Fotolife.prototype._toJson '<>'
            .then null, (e) ->
              assert e instanceof Error
            .then (-> done()), done

      describe '_toXml', ->
        it 'works', (done) ->
          Fotolife.prototype._toXml 1
            .then null, (e) ->
              assert e instanceof Error
            .then (-> done()), done

    describe 'single elements', ->
      beforeEach ->
        @xml = '''
          <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <entry xmlns="http://purl.org/atom/ns#">
            <title>&lt;TITLE</title>
            <content mode="base64" type="&quot;TYPE">&lt;ENCODED</content>
          </entry>
        '''
        @json =
          entry:
            $:
              xmlns: 'http://purl.org/atom/ns#'
            title:
              _: '<TITLE'
            content:
              $:
                mode: 'base64'
                type: '"TYPE'
              _: '<ENCODED'

      describe '_toJson', ->
        it 'works', (done) ->
          Fotolife.prototype._toJson @xml
            .then (json) =>
              assert.deepEqual json, @json
            .then (-> done()), done

      describe '_toXml', ->
        it 'works', (done) ->
          Fotolife.prototype._toXml @json
            .then (xml) =>
              assert xml is @xml
            .then (-> done()), done

    describe 'multiple elements', ->
      beforeEach ->
        @xml = '''
          <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <entry xmlns="http://purl.org/atom/ns#">
            <title attr="ATTR1">&lt;TITLE1</title>
            <title attr="ATTR2">&lt;TITLE2</title>
          </entry>
        '''
        @json =
          entry:
            $:
              xmlns: 'http://purl.org/atom/ns#'
            title:
              [
                $:
                  attr: 'ATTR1'
                _: '<TITLE1'
              ,
                $:
                  attr: 'ATTR2'
                _: '<TITLE2'
              ]

      describe '_toJson', ->
        it 'works', (done) ->
          Fotolife.prototype._toJson @xml
            .then (json) =>
              assert.deepEqual json, @json
            .then (-> done()), done

      describe '_toXml', ->
        it 'works', (done) ->
          Fotolife.prototype._toXml @json
            .then (xml) =>
              assert xml is @xml
            .then (-> done()), done
