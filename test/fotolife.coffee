assert = require 'power-assert'
path = require 'path'
sinon = require 'sinon'

describe 'fotolife', ->
  beforeEach ->
    @sinon = sinon.sandbox.create()

  afterEach ->
    @sinon.restore()

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
