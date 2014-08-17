assert = require 'power-assert'
path = require 'path'
sinon = require 'sinon'

describe 'fotolife', ->
  beforeEach ->
    @sinon = sinon.sandbox.create()

  afterEach ->
    @robot.shutdown()
