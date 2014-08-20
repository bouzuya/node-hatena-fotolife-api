assert = require 'power-assert'
path = require 'path'
sinon = require 'sinon'

describe 'fotolife', ->
  beforeEach ->
    @sinon = sinon.sandbox.create()

  afterEach ->
    @sinon.restore()

  describe 'create', ->
    beforeEach ->
      Fotolife = require '../src/fotolife'
      @request = @sinon.stub Fotolife.prototype, '_request', -> null
      @fotolife = new Fotolife
        type: 'wsse'
        username: 'username'
        apikey: 'apikey'

    describe 'no file options', ->
      it 'returns error', (done) ->
        pngfile = path.resolve __dirname, '../examples/bouzuya.png'
        @fotolife.create {}, (e) =>
          assert @request.callCount is 0
          assert e instanceof Error
          done()

    describe 'default options', ->
      it 'works', ->
        pngfile = path.resolve __dirname, '../examples/bouzuya.png'
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
        pngfile = path.resolve __dirname, '../examples/bouzuya.png'
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
      Fotolife = require '../src/fotolife'
      @request = @sinon.stub Fotolife.prototype, '_request', -> null
      @fotolife = new Fotolife
        type: 'wsse'
        username: 'username'
        apikey: 'apikey'

    describe 'no id options', ->
      it 'returns error', (done) ->
        pngfile = path.resolve __dirname, '../examples/bouzuya.png'
        @fotolife.update {}, (e) =>
          assert @request.callCount is 0
          assert e instanceof Error
          done()

    describe 'no title options', ->
      it 'returns error', (done) ->
        pngfile = path.resolve __dirname, '../examples/bouzuya.png'
        @fotolife.update { id: 123 }, (e) =>
          assert @request.callCount is 0
          assert e instanceof Error
          done()

    describe 'all options', ->
      it 'works', ->
        pngfile = path.resolve __dirname, '../examples/bouzuya.png'
        @fotolife.update { id: 123, title: 'TITLE' }, -> null
        assert @request.firstCall.args[0].method is 'put'
        assert @request.firstCall.args[0].path is '/atom/edit/123'
        body = @request.firstCall.args[0].body
        assert body.entry.title._ is 'TITLE'

  describe 'destroy', ->
    beforeEach ->
      Fotolife = require '../src/fotolife'
      @request = @sinon.stub Fotolife.prototype, '_request', -> null
      @fotolife = new Fotolife
        type: 'wsse'
        username: 'username'
        apikey: 'apikey'

    describe 'no id options', ->
      it 'returns error', (done) ->
        pngfile = path.resolve __dirname, '../examples/bouzuya.png'
        @fotolife.destroy {}, (e) =>
          assert @request.callCount is 0
          assert e instanceof Error
          done()

    describe 'all options', ->
      it 'works', ->
        pngfile = path.resolve __dirname, '../examples/bouzuya.png'
        @fotolife.destroy { id: 123 }, -> null
        assert @request.firstCall.args[0].method is 'delete'
        assert @request.firstCall.args[0].path is '/atom/edit/123'

  describe '_toXml', ->
    it 'works', ->
      Fotolife = require '../src/fotolife'
      xml = Fotolife.prototype._toXml
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
      assert xml is '''
        <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <entry xmlns="http://purl.org/atom/ns#">
          <title>&lt;TITLE</title>
          <content mode="base64" type="&quot;TYPE">&lt;ENCODED</content>
        </entry>
      '''
