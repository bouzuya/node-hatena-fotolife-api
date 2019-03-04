var Fotolife, assert, path, sinon;
assert = require('power-assert');
path = require('path');
sinon = require('sinon');
Fotolife = require('../src/fotolife');
describe('fotolife', function () {
    beforeEach(function () {
        return this.sinon = sinon.sandbox.create();
    });
    afterEach(function () {
        return this.sinon.restore();
    });
    describe('constructor', function () {
        describe('use wsse', function () {
            beforeEach(function () {
                return this.fotolife = new Fotolife({
                    username: 'username',
                    apikey: 'apikey'
                });
            });
            return it('works', function () {
                assert(assert._expr(assert._capt(assert._capt(assert._capt(this.fotolife, 'arguments/0/left/object')._type, 'arguments/0/left') === 'wsse', 'arguments/0'), {
                    content: 'assert(this.fotolife._type === \'wsse\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 27
                }));
                assert(assert._expr(assert._capt(assert._capt(assert._capt(this.fotolife, 'arguments/0/left/object')._username, 'arguments/0/left') === 'username', 'arguments/0'), {
                    content: 'assert(this.fotolife._username === \'username\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 28
                }));
                return assert(assert._expr(assert._capt(assert._capt(assert._capt(this.fotolife, 'arguments/0/left/object')._apikey, 'arguments/0/left') === 'apikey', 'arguments/0'), {
                    content: 'assert(this.fotolife._apikey === \'apikey\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 29
                }));
            });
        });
        return describe('use oauth', function () {
            beforeEach(function () {
                return this.fotolife = new Fotolife({
                    type: 'oauth',
                    consumerKey: 'consumerKey',
                    consumerSecret: 'consumerSecret',
                    accessToken: 'accessToken',
                    accessTokenSecret: 'accessTokenSecret'
                });
            });
            return it('works', function () {
                assert(assert._expr(assert._capt(assert._capt(assert._capt(this.fotolife, 'arguments/0/left/object')._type, 'arguments/0/left') === 'oauth', 'arguments/0'), {
                    content: 'assert(this.fotolife._type === \'oauth\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 43
                }));
                assert(assert._expr(assert._capt(assert._capt(assert._capt(this.fotolife, 'arguments/0/left/object')._consumerKey, 'arguments/0/left') === 'consumerKey', 'arguments/0'), {
                    content: 'assert(this.fotolife._consumerKey === \'consumerKey\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 44
                }));
                assert(assert._expr(assert._capt(assert._capt(assert._capt(this.fotolife, 'arguments/0/left/object')._consumerSecret, 'arguments/0/left') === 'consumerSecret', 'arguments/0'), {
                    content: 'assert(this.fotolife._consumerSecret === \'consumerSecret\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 45
                }));
                assert(assert._expr(assert._capt(assert._capt(assert._capt(this.fotolife, 'arguments/0/left/object')._accessToken, 'arguments/0/left') === 'accessToken', 'arguments/0'), {
                    content: 'assert(this.fotolife._accessToken === \'accessToken\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 46
                }));
                return assert(assert._expr(assert._capt(assert._capt(assert._capt(this.fotolife, 'arguments/0/left/object')._accessTokenSecret, 'arguments/0/left') === 'accessTokenSecret', 'arguments/0'), {
                    content: 'assert(this.fotolife._accessTokenSecret === \'accessTokenSecret\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 47
                }));
            });
        });
    });
    describe('create', function () {
        beforeEach(function () {
            this.request = this.sinon.stub(Fotolife.prototype, '_request', function () {
                return null;
            });
            return this.fotolife = new Fotolife({
                type: 'wsse',
                username: 'username',
                apikey: 'apikey'
            });
        });
        describe('no file options', function () {
            describe('callback style', function () {
                describe('normal case', function () {
                    return it('calls callback with error', function (done) {
                        return this.fotolife.create({}, function (_this) {
                            return function (e) {
                                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(_this, 'arguments/0/left/object/object').request, 'arguments/0/left/object').callCount, 'arguments/0/left') === 0, 'arguments/0'), {
                                    content: 'assert(_this.request.callCount === 0)',
                                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                    line: 68
                                }));
                                assert(assert._expr(assert._capt(assert._capt(e, 'arguments/0/left') instanceof assert._capt(Error, 'arguments/0/right'), 'arguments/0'), {
                                    content: 'assert(e instanceof Error)',
                                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                    line: 69
                                }));
                                return done();
                            };
                        }(this));
                    });
                });
                return describe('callback throws error', function () {
                    return it('returns promise', function () {
                        var promise;
                        promise = this.fotolife.create({}, function () {
                            throw new Error();
                        });
                        return assert(assert._expr(assert._capt(assert._capt(assert._capt(promise, 'arguments/0/left/object').then, 'arguments/0/left') != null, 'arguments/0'), {
                            content: 'assert(promise.then != null)',
                            filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                            line: 81
                        }));
                    });
                });
            });
            return describe('promise style', function () {
                return it('calls onError', function (done) {
                    return this.fotolife.create({}).then(null, function (_this) {
                        return function (e) {
                            assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(_this, 'arguments/0/left/object/object').request, 'arguments/0/left/object').callCount, 'arguments/0/left') === 0, 'arguments/0'), {
                                content: 'assert(_this.request.callCount === 0)',
                                filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                line: 89
                            }));
                            return assert(assert._expr(assert._capt(assert._capt(e, 'arguments/0/left') instanceof assert._capt(Error, 'arguments/0/right'), 'arguments/0'), {
                                content: 'assert(e instanceof Error)',
                                filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                line: 90
                            }));
                        };
                    }(this)).then(function () {
                        return done();
                    }, done);
                });
            });
        });
        describe('file not exists', function () {
            return it('calls callback with error', function (done) {
                return this.fotolife.create({ file: 'noexists' }, function (_this) {
                    return function (e) {
                        assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(_this, 'arguments/0/left/object/object').request, 'arguments/0/left/object').callCount, 'arguments/0/left') === 0, 'arguments/0'), {
                            content: 'assert(_this.request.callCount === 0)',
                            filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                            line: 104
                        }));
                        assert(assert._expr(assert._capt(assert._capt(e, 'arguments/0/left') instanceof assert._capt(Error, 'arguments/0/right'), 'arguments/0'), {
                            content: 'assert(e instanceof Error)',
                            filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                            line: 105
                        }));
                        return done();
                    };
                }(this));
            });
        });
        describe('default options', function () {
            return it('works', function () {
                var body, pngfile;
                pngfile = path.resolve(__dirname, './bouzuya.png');
                this.fotolife.create({ file: pngfile }, function () {
                    return null;
                });
                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(this.request, 'arguments/0/left/object/object/object/object').firstCall, 'arguments/0/left/object/object/object').args, 'arguments/0/left/object/object')[0], 'arguments/0/left/object').method, 'arguments/0/left') === 'post', 'arguments/0'), {
                    content: 'assert(this.request.firstCall.args[0].method === \'post\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 120
                }));
                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(this.request, 'arguments/0/left/object/object/object/object').firstCall, 'arguments/0/left/object/object/object').args, 'arguments/0/left/object/object')[0], 'arguments/0/left/object').path, 'arguments/0/left') === '/atom/post', 'arguments/0'), {
                    content: 'assert(this.request.firstCall.args[0].path === \'/atom/post\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 121
                }));
                body = this.request.firstCall.args[0].body;
                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(body, 'arguments/0/left/object/object/object').entry, 'arguments/0/left/object/object').title, 'arguments/0/left/object')._, 'arguments/0/left') === '', 'arguments/0'), {
                    content: 'assert(body.entry.title._ === \'\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 123
                }));
                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(body, 'arguments/0/left/object/object/object/object').entry, 'arguments/0/left/object/object/object').content, 'arguments/0/left/object/object').$, 'arguments/0/left/object').type, 'arguments/0/left') === 'image/png', 'arguments/0'), {
                    content: 'assert(body.entry.content.$.type === \'image/png\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 124
                }));
                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(body, 'arguments/0/left/object/object').entry, 'arguments/0/left/object')['dc:subject'], 'arguments/0/left') === assert._capt(void 0, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(body.entry[\'dc:subject\'] === void 0)',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 125
                }));
                return assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(body, 'arguments/0/left/object/object').entry, 'arguments/0/left/object').generator, 'arguments/0/left') === assert._capt(void 0, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(body.entry.generator === void 0)',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 126
                }));
            });
        });
        return describe('all options', function () {
            return it('works', function () {
                var body, pngfile;
                pngfile = path.resolve(__dirname, './bouzuya.png');
                this.fotolife.create({
                    file: pngfile,
                    title: 'TITLE',
                    type: 'TYPE',
                    folder: 'FOLDER',
                    generator: 'GENERATOR'
                }, function () {
                    return null;
                });
                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(this.request, 'arguments/0/left/object/object/object/object').firstCall, 'arguments/0/left/object/object/object').args, 'arguments/0/left/object/object')[0], 'arguments/0/left/object').method, 'arguments/0/left') === 'post', 'arguments/0'), {
                    content: 'assert(this.request.firstCall.args[0].method === \'post\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 142
                }));
                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(this.request, 'arguments/0/left/object/object/object/object').firstCall, 'arguments/0/left/object/object/object').args, 'arguments/0/left/object/object')[0], 'arguments/0/left/object').path, 'arguments/0/left') === '/atom/post', 'arguments/0'), {
                    content: 'assert(this.request.firstCall.args[0].path === \'/atom/post\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 143
                }));
                body = this.request.firstCall.args[0].body;
                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(body, 'arguments/0/left/object/object/object').entry, 'arguments/0/left/object/object').title, 'arguments/0/left/object')._, 'arguments/0/left') === 'TITLE', 'arguments/0'), {
                    content: 'assert(body.entry.title._ === \'TITLE\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 145
                }));
                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(body, 'arguments/0/left/object/object/object/object').entry, 'arguments/0/left/object/object/object').content, 'arguments/0/left/object/object').$, 'arguments/0/left/object').type, 'arguments/0/left') === 'TYPE', 'arguments/0'), {
                    content: 'assert(body.entry.content.$.type === \'TYPE\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 146
                }));
                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(body, 'arguments/0/left/object/object/object').entry, 'arguments/0/left/object/object')['dc:subject'], 'arguments/0/left/object')._, 'arguments/0/left') === 'FOLDER', 'arguments/0'), {
                    content: 'assert(body.entry[\'dc:subject\']._ === \'FOLDER\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 147
                }));
                return assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(body, 'arguments/0/left/object/object/object').entry, 'arguments/0/left/object/object').generator, 'arguments/0/left/object')._, 'arguments/0/left') === 'GENERATOR', 'arguments/0'), {
                    content: 'assert(body.entry.generator._ === \'GENERATOR\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 148
                }));
            });
        });
    });
    describe('update', function () {
        beforeEach(function () {
            this.request = this.sinon.stub(Fotolife.prototype, '_request', function () {
                return null;
            });
            return this.fotolife = new Fotolife({
                type: 'wsse',
                username: 'username',
                apikey: 'apikey'
            });
        });
        describe('no id options', function () {
            return it('calls callback with error', function (done) {
                return this.fotolife.update({}, function (_this) {
                    return function (e) {
                        assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(_this, 'arguments/0/left/object/object').request, 'arguments/0/left/object').callCount, 'arguments/0/left') === 0, 'arguments/0'), {
                            content: 'assert(_this.request.callCount === 0)',
                            filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                            line: 167
                        }));
                        assert(assert._expr(assert._capt(assert._capt(e, 'arguments/0/left') instanceof assert._capt(Error, 'arguments/0/right'), 'arguments/0'), {
                            content: 'assert(e instanceof Error)',
                            filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                            line: 168
                        }));
                        return done();
                    };
                }(this));
            });
        });
        describe('no title options', function () {
            return it('calls callback with error', function (done) {
                return this.fotolife.update({ id: 123 }, function (_this) {
                    return function (e) {
                        assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(_this, 'arguments/0/left/object/object').request, 'arguments/0/left/object').callCount, 'arguments/0/left') === 0, 'arguments/0'), {
                            content: 'assert(_this.request.callCount === 0)',
                            filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                            line: 180
                        }));
                        assert(assert._expr(assert._capt(assert._capt(e, 'arguments/0/left') instanceof assert._capt(Error, 'arguments/0/right'), 'arguments/0'), {
                            content: 'assert(e instanceof Error)',
                            filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                            line: 181
                        }));
                        return done();
                    };
                }(this));
            });
        });
        return describe('all options', function () {
            return it('works', function () {
                var body;
                this.fotolife.update({
                    id: 123,
                    title: 'TITLE'
                }, function () {
                    return null;
                });
                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(this.request, 'arguments/0/left/object/object/object/object').firstCall, 'arguments/0/left/object/object/object').args, 'arguments/0/left/object/object')[0], 'arguments/0/left/object').method, 'arguments/0/left') === 'put', 'arguments/0'), {
                    content: 'assert(this.request.firstCall.args[0].method === \'put\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 196
                }));
                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(this.request, 'arguments/0/left/object/object/object/object').firstCall, 'arguments/0/left/object/object/object').args, 'arguments/0/left/object/object')[0], 'arguments/0/left/object').path, 'arguments/0/left') === '/atom/edit/123', 'arguments/0'), {
                    content: 'assert(this.request.firstCall.args[0].path === \'/atom/edit/123\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 197
                }));
                body = this.request.firstCall.args[0].body;
                return assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(body, 'arguments/0/left/object/object/object').entry, 'arguments/0/left/object/object').title, 'arguments/0/left/object')._, 'arguments/0/left') === 'TITLE', 'arguments/0'), {
                    content: 'assert(body.entry.title._ === \'TITLE\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 199
                }));
            });
        });
    });
    describe('destroy', function () {
        beforeEach(function () {
            this.request = this.sinon.stub(Fotolife.prototype, '_request', function () {
                return null;
            });
            return this.fotolife = new Fotolife({
                type: 'wsse',
                username: 'username',
                apikey: 'apikey'
            });
        });
        describe('no id options', function () {
            return it('calls callback with error', function (done) {
                return this.fotolife.destroy({}, function (_this) {
                    return function (e) {
                        assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(_this, 'arguments/0/left/object/object').request, 'arguments/0/left/object').callCount, 'arguments/0/left') === 0, 'arguments/0'), {
                            content: 'assert(_this.request.callCount === 0)',
                            filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                            line: 218
                        }));
                        assert(assert._expr(assert._capt(assert._capt(e, 'arguments/0/left') instanceof assert._capt(Error, 'arguments/0/right'), 'arguments/0'), {
                            content: 'assert(e instanceof Error)',
                            filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                            line: 219
                        }));
                        return done();
                    };
                }(this));
            });
        });
        return describe('all options', function () {
            return it('works', function () {
                this.fotolife.destroy({ id: 123 }, function () {
                    return null;
                });
                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(this.request, 'arguments/0/left/object/object/object/object').firstCall, 'arguments/0/left/object/object/object').args, 'arguments/0/left/object/object')[0], 'arguments/0/left/object').method, 'arguments/0/left') === 'delete', 'arguments/0'), {
                    content: 'assert(this.request.firstCall.args[0].method === \'delete\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 232
                }));
                return assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(this.request, 'arguments/0/left/object/object/object/object').firstCall, 'arguments/0/left/object/object/object').args, 'arguments/0/left/object/object')[0], 'arguments/0/left/object').path, 'arguments/0/left') === '/atom/edit/123', 'arguments/0'), {
                    content: 'assert(this.request.firstCall.args[0].path === \'/atom/edit/123\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 233
                }));
            });
        });
    });
    describe('show', function () {
        beforeEach(function () {
            this.request = this.sinon.stub(Fotolife.prototype, '_request', function () {
                return null;
            });
            return this.fotolife = new Fotolife({
                type: 'wsse',
                username: 'username',
                apikey: 'apikey'
            });
        });
        describe('no id options', function () {
            return it('calls callback with error', function (done) {
                return this.fotolife.show({}, function (_this) {
                    return function (e) {
                        assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(_this, 'arguments/0/left/object/object').request, 'arguments/0/left/object').callCount, 'arguments/0/left') === 0, 'arguments/0'), {
                            content: 'assert(_this.request.callCount === 0)',
                            filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                            line: 252
                        }));
                        assert(assert._expr(assert._capt(assert._capt(e, 'arguments/0/left') instanceof assert._capt(Error, 'arguments/0/right'), 'arguments/0'), {
                            content: 'assert(e instanceof Error)',
                            filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                            line: 253
                        }));
                        return done();
                    };
                }(this));
            });
        });
        return describe('all options', function () {
            return it('works', function () {
                this.fotolife.show({ id: 123 }, function () {
                    return null;
                });
                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(this.request, 'arguments/0/left/object/object/object/object').firstCall, 'arguments/0/left/object/object/object').args, 'arguments/0/left/object/object')[0], 'arguments/0/left/object').method, 'arguments/0/left') === 'get', 'arguments/0'), {
                    content: 'assert(this.request.firstCall.args[0].method === \'get\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 266
                }));
                return assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(this.request, 'arguments/0/left/object/object/object/object').firstCall, 'arguments/0/left/object/object/object').args, 'arguments/0/left/object/object')[0], 'arguments/0/left/object').path, 'arguments/0/left') === '/atom/edit/123', 'arguments/0'), {
                    content: 'assert(this.request.firstCall.args[0].path === \'/atom/edit/123\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 267
                }));
            });
        });
    });
    describe('index', function () {
        beforeEach(function () {
            this.request = this.sinon.stub(Fotolife.prototype, '_request', function () {
                return null;
            });
            return this.fotolife = new Fotolife({
                type: 'wsse',
                username: 'username',
                apikey: 'apikey'
            });
        });
        describe('all options', function () {
            return it('works', function () {
                this.fotolife.index({}, function () {
                    return null;
                });
                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(this.request, 'arguments/0/left/object/object/object/object').firstCall, 'arguments/0/left/object/object/object').args, 'arguments/0/left/object/object')[0], 'arguments/0/left/object').method, 'arguments/0/left') === 'get', 'arguments/0'), {
                    content: 'assert(this.request.firstCall.args[0].method === \'get\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 287
                }));
                return assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(this.request, 'arguments/0/left/object/object/object/object').firstCall, 'arguments/0/left/object/object/object').args, 'arguments/0/left/object/object')[0], 'arguments/0/left/object').path, 'arguments/0/left') === '/atom/feed', 'arguments/0'), {
                    content: 'assert(this.request.firstCall.args[0].path === \'/atom/feed\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 288
                }));
            });
        });
        return describe('callback only', function () {
            return it('works', function () {
                this.fotolife.index(function () {
                    return null;
                });
                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(this.request, 'arguments/0/left/object/object/object/object').firstCall, 'arguments/0/left/object/object/object').args, 'arguments/0/left/object/object')[0], 'arguments/0/left/object').method, 'arguments/0/left') === 'get', 'arguments/0'), {
                    content: 'assert(this.request.firstCall.args[0].method === \'get\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 296
                }));
                return assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(this.request, 'arguments/0/left/object/object/object/object').firstCall, 'arguments/0/left/object/object/object').args, 'arguments/0/left/object/object')[0], 'arguments/0/left/object').path, 'arguments/0/left') === '/atom/feed', 'arguments/0'), {
                    content: 'assert(this.request.firstCall.args[0].path === \'/atom/feed\')',
                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                    line: 297
                }));
            });
        });
    });
    describe('_request', function () {
        describe('request succeed', function () {
            beforeEach(function () {
                return this.request = this.sinon.stub(Fotolife.prototype, '_requestPromise', function () {
                    return {
                        then: function (onFulFilled) {
                            return onFulFilled({
                                body: '',
                                statusCode: 200
                            });
                        }
                    };
                });
            });
            describe('wsse auth', function () {
                beforeEach(function () {
                    return this.fotolife = new Fotolife({
                        type: 'wsse',
                        username: 'username',
                        apikey: 'apikey'
                    });
                });
                describe('callback style', function () {
                    return it('works', function (done) {
                        return this.fotolife._request({
                            method: 'METHOD',
                            path: 'PATH',
                            body: { feed: { _: 'test' } },
                            statusCode: 200
                        }, function (_this) {
                            return function (err, res) {
                                var args, e;
                                try {
                                    args = _this.request.firstCall.args;
                                    assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(args, 'arguments/0/left/object/object')[0], 'arguments/0/left/object').method, 'arguments/0/left') === 'METHOD', 'arguments/0'), {
                                        content: 'assert(args[0].method === \'METHOD\')',
                                        filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                        line: 339
                                    }));
                                    assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(args, 'arguments/0/left/object/object')[0], 'arguments/0/left/object').url, 'arguments/0/left') === 'http://f.hatena.ne.jpPATH', 'arguments/0'), {
                                        content: 'assert(args[0].url === \'http://f.hatena.ne.jpPATH\')',
                                        filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                        line: 340
                                    }));
                                    assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(args, 'arguments/0/left/object/object/object')[0], 'arguments/0/left/object/object').headers, 'arguments/0/left/object').Authorization, 'arguments/0/left') != null, 'arguments/0'), {
                                        content: 'assert(args[0].headers.Authorization != null)',
                                        filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                        line: 341
                                    }));
                                    assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(args, 'arguments/0/left/object/object/object')[0], 'arguments/0/left/object/object').headers, 'arguments/0/left/object')['X-WSSE'], 'arguments/0/left') != null, 'arguments/0'), {
                                        content: 'assert(args[0].headers[\'X-WSSE\'] != null)',
                                        filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                        line: 342
                                    }));
                                } catch (error) {
                                    e = error;
                                    done(e);
                                }
                                return done(err);
                            };
                        }(this));
                    });
                });
                return describe('promise style', function () {
                    describe('normal case', function () {
                        return it('works', function (done) {
                            return this.fotolife._request({
                                method: 'METHOD',
                                path: 'PATH',
                                statusCode: 200
                            }).then(function (_this) {
                                return function () {
                                    var args;
                                    args = _this.request.firstCall.args;
                                    assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(args, 'arguments/0/left/object/object')[0], 'arguments/0/left/object').method, 'arguments/0/left') === 'METHOD', 'arguments/0'), {
                                        content: 'assert(args[0].method === \'METHOD\')',
                                        filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                        line: 363
                                    }));
                                    assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(args, 'arguments/0/left/object/object')[0], 'arguments/0/left/object').url, 'arguments/0/left') === 'http://f.hatena.ne.jpPATH', 'arguments/0'), {
                                        content: 'assert(args[0].url === \'http://f.hatena.ne.jpPATH\')',
                                        filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                        line: 364
                                    }));
                                    assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(args, 'arguments/0/left/object/object/object')[0], 'arguments/0/left/object/object').headers, 'arguments/0/left/object').Authorization, 'arguments/0/left') != null, 'arguments/0'), {
                                        content: 'assert(args[0].headers.Authorization != null)',
                                        filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                        line: 365
                                    }));
                                    return assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(args, 'arguments/0/left/object/object/object')[0], 'arguments/0/left/object/object').headers, 'arguments/0/left/object')['X-WSSE'], 'arguments/0/left') != null, 'arguments/0'), {
                                        content: 'assert(args[0].headers[\'X-WSSE\'] != null)',
                                        filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                        line: 366
                                    }));
                                };
                            }(this)).then(function () {
                                return done();
                            }, done);
                        });
                    });
                    return describe('invalid status code', function () {
                        return it('works', function (done) {
                            return this.fotolife._request({
                                method: 'METHOD',
                                path: 'PATH',
                                statusCode: 201
                            }).then(null, function (e) {
                                return assert(assert._expr(assert._capt(assert._capt(e, 'arguments/0/left') instanceof assert._capt(Error, 'arguments/0/right'), 'arguments/0'), {
                                    content: 'assert(e instanceof Error)',
                                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                    line: 380
                                }));
                            }).then(function () {
                                return done();
                            }, done);
                        });
                    });
                });
            });
            return describe('oauth auth', function () {
                beforeEach(function () {
                    return this.fotolife = new Fotolife({
                        type: 'oauth',
                        consumerKey: 'CONSUMER_KEY',
                        consumerSecret: 'CONSUMER_SECRET',
                        accessToken: 'ACCESS_TOKEN',
                        accessTokenSecret: 'ACCESS_TOKEN_SECRET'
                    });
                });
                describe('callback style', function () {
                    return it('works', function (done) {
                        return this.fotolife._request({
                            method: 'METHOD',
                            path: 'PATH',
                            statusCode: 200
                        }, function (_this) {
                            return function (err, res) {
                                var args;
                                args = _this.request.firstCall.args;
                                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(args, 'arguments/0/left/object/object')[0], 'arguments/0/left/object').method, 'arguments/0/left') === 'METHOD', 'arguments/0'), {
                                    content: 'assert(args[0].method === \'METHOD\')',
                                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                    line: 408
                                }));
                                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(args, 'arguments/0/left/object/object')[0], 'arguments/0/left/object').url, 'arguments/0/left') === 'http://f.hatena.ne.jpPATH', 'arguments/0'), {
                                    content: 'assert(args[0].url === \'http://f.hatena.ne.jpPATH\')',
                                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                    line: 409
                                }));
                                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(args, 'arguments/0/left/object/object/object')[0], 'arguments/0/left/object/object').oauth, 'arguments/0/left/object').consumer_key, 'arguments/0/left') === 'CONSUMER_KEY', 'arguments/0'), {
                                    content: 'assert(args[0].oauth.consumer_key === \'CONSUMER_KEY\')',
                                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                    line: 410
                                }));
                                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(args, 'arguments/0/left/object/object/object')[0], 'arguments/0/left/object/object').oauth, 'arguments/0/left/object').consumer_secret, 'arguments/0/left') === 'CONSUMER_SECRET', 'arguments/0'), {
                                    content: 'assert(args[0].oauth.consumer_secret === \'CONSUMER_SECRET\')',
                                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                    line: 411
                                }));
                                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(args, 'arguments/0/left/object/object/object')[0], 'arguments/0/left/object/object').oauth, 'arguments/0/left/object').token, 'arguments/0/left') === 'ACCESS_TOKEN', 'arguments/0'), {
                                    content: 'assert(args[0].oauth.token === \'ACCESS_TOKEN\')',
                                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                    line: 412
                                }));
                                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(args, 'arguments/0/left/object/object/object')[0], 'arguments/0/left/object/object').oauth, 'arguments/0/left/object').token_secret, 'arguments/0/left') === 'ACCESS_TOKEN_SECRET', 'arguments/0'), {
                                    content: 'assert(args[0].oauth.token_secret === \'ACCESS_TOKEN_SECRET\')',
                                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                    line: 413
                                }));
                                return done(err);
                            };
                        }(this));
                    });
                });
                return describe('promise style', function () {
                    return it('works', function (done) {
                        return this.fotolife._request({
                            method: 'METHOD',
                            path: 'PATH',
                            statusCode: 200
                        }).then(function (_this) {
                            return function () {
                                var args;
                                args = _this.request.firstCall.args;
                                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(args, 'arguments/0/left/object/object')[0], 'arguments/0/left/object').method, 'arguments/0/left') === 'METHOD', 'arguments/0'), {
                                    content: 'assert(args[0].method === \'METHOD\')',
                                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                    line: 429
                                }));
                                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(args, 'arguments/0/left/object/object')[0], 'arguments/0/left/object').url, 'arguments/0/left') === 'http://f.hatena.ne.jpPATH', 'arguments/0'), {
                                    content: 'assert(args[0].url === \'http://f.hatena.ne.jpPATH\')',
                                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                    line: 430
                                }));
                                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(args, 'arguments/0/left/object/object/object')[0], 'arguments/0/left/object/object').oauth, 'arguments/0/left/object').consumer_key, 'arguments/0/left') === 'CONSUMER_KEY', 'arguments/0'), {
                                    content: 'assert(args[0].oauth.consumer_key === \'CONSUMER_KEY\')',
                                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                    line: 431
                                }));
                                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(args, 'arguments/0/left/object/object/object')[0], 'arguments/0/left/object/object').oauth, 'arguments/0/left/object').consumer_secret, 'arguments/0/left') === 'CONSUMER_SECRET', 'arguments/0'), {
                                    content: 'assert(args[0].oauth.consumer_secret === \'CONSUMER_SECRET\')',
                                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                    line: 432
                                }));
                                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(args, 'arguments/0/left/object/object/object')[0], 'arguments/0/left/object/object').oauth, 'arguments/0/left/object').token, 'arguments/0/left') === 'ACCESS_TOKEN', 'arguments/0'), {
                                    content: 'assert(args[0].oauth.token === \'ACCESS_TOKEN\')',
                                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                    line: 433
                                }));
                                return assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(assert._capt(args, 'arguments/0/left/object/object/object')[0], 'arguments/0/left/object/object').oauth, 'arguments/0/left/object').token_secret, 'arguments/0/left') === 'ACCESS_TOKEN_SECRET', 'arguments/0'), {
                                    content: 'assert(args[0].oauth.token_secret === \'ACCESS_TOKEN_SECRET\')',
                                    filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                    line: 434
                                }));
                            };
                        }(this)).then(function () {
                            return done();
                        }, done);
                    });
                });
            });
        });
        return describe('request failure', function () {
            beforeEach(function () {
                return this.request = this.sinon.stub(Fotolife.prototype, '_requestPromise', function () {
                    return {
                        then: function (_, onError) {
                            return onError(new Error());
                        }
                    };
                });
            });
            describe('wsse auth', function () {
                beforeEach(function () {
                    return this.fotolife = new Fotolife({
                        type: 'wsse',
                        username: 'username',
                        apikey: 'apikey'
                    });
                });
                describe('callback style', function () {
                    return it('works', function (done) {
                        return this.fotolife._request({
                            method: 'METHOD',
                            path: 'PATH'
                        }, function (err) {
                            assert(assert._expr(assert._capt(assert._capt(err, 'arguments/0/left') instanceof assert._capt(Error, 'arguments/0/right'), 'arguments/0'), {
                                content: 'assert(err instanceof Error)',
                                filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                line: 467
                            }));
                            return done();
                        });
                    });
                });
                return describe('promise style', function () {
                    return it('works', function (done) {
                        return this.fotolife._request({
                            method: 'METHOD',
                            path: 'PATH'
                        }).then(null, function (e) {
                            return assert(assert._expr(assert._capt(assert._capt(e, 'arguments/0/left') instanceof assert._capt(Error, 'arguments/0/right'), 'arguments/0'), {
                                content: 'assert(e instanceof Error)',
                                filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                line: 478
                            }));
                        }).then(function () {
                            return done();
                        }, done);
                    });
                });
            });
            return describe('oauth auth', function () {
                beforeEach(function () {
                    return this.fotolife = new Fotolife({
                        type: 'oauth',
                        consumerKey: 'CONSUMER_KEY',
                        consumerSecret: 'CONSUMER_SECRET',
                        accessToken: 'ACCESS_TOKEN',
                        accessTokenSecret: 'ACCESS_TOKEN_SECRET'
                    });
                });
                describe('callback style', function () {
                    return it('works', function (done) {
                        return this.fotolife._request({
                            method: 'METHOD',
                            path: 'PATH'
                        }, function (err) {
                            assert(assert._expr(assert._capt(assert._capt(err, 'arguments/0/left') instanceof assert._capt(Error, 'arguments/0/right'), 'arguments/0'), {
                                content: 'assert(err instanceof Error)',
                                filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                line: 501
                            }));
                            return done();
                        });
                    });
                });
                return describe('promise style', function () {
                    return it('works', function (done) {
                        return this.fotolife._request({
                            method: 'METHOD',
                            path: 'PATH'
                        }).then(null, function (e) {
                            return assert(assert._expr(assert._capt(assert._capt(e, 'arguments/0/left') instanceof assert._capt(Error, 'arguments/0/right'), 'arguments/0'), {
                                content: 'assert(e instanceof Error)',
                                filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                line: 512
                            }));
                        }).then(function () {
                            return done();
                        }, done);
                    });
                });
            });
        });
    });
    describe('_requestPromise', function () {
        describe('request succeed', function () {
            return it('works', function (done) {
                var params, promise;
                params = {
                    a: 'a',
                    b: 1
                };
                this.request = this.sinon.stub(Fotolife.prototype, '_rawRequest', function (_, cb) {
                    return cb(null);
                });
                promise = Fotolife.prototype._requestPromise(params);
                return promise.then(function () {
                    return done();
                }, done);
            });
        });
        return describe('request failure', function () {
            return it('works', function (done) {
                var params, promise;
                params = {
                    a: 'a',
                    b: 1
                };
                this.request = this.sinon.stub(Fotolife.prototype, '_rawRequest', function (_, cb) {
                    return cb(new Error());
                });
                promise = Fotolife.prototype._requestPromise(params);
                return promise.then(null, function (e) {
                    return assert(assert._expr(assert._capt(assert._capt(e, 'arguments/0/left') instanceof assert._capt(Error, 'arguments/0/right'), 'arguments/0'), {
                        content: 'assert(e instanceof Error)',
                        filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                        line: 550
                    }));
                }).then(function () {
                    return done();
                }, done);
            });
        });
    });
    return describe('_toJson / _toXml', function () {
        describe('invalid elements', function () {
            describe('_toJson', function () {
                return it('works', function (done) {
                    return Fotolife.prototype._toJson('<>').then(null, function (e) {
                        return assert(assert._expr(assert._capt(assert._capt(e, 'arguments/0/left') instanceof assert._capt(Error, 'arguments/0/right'), 'arguments/0'), {
                            content: 'assert(e instanceof Error)',
                            filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                            line: 562
                        }));
                    }).then(function () {
                        return done();
                    }, done);
                });
            });
            return describe('_toXml', function () {
                return it('works', function (done) {
                    return Fotolife.prototype._toXml(1).then(null, function (e) {
                        return assert(assert._expr(assert._capt(assert._capt(e, 'arguments/0/left') instanceof assert._capt(Error, 'arguments/0/right'), 'arguments/0'), {
                            content: 'assert(e instanceof Error)',
                            filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                            line: 571
                        }));
                    }).then(function () {
                        return done();
                    }, done);
                });
            });
        });
        describe('single elements', function () {
            beforeEach(function () {
                this.xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<entry xmlns="http://purl.org/atom/ns#">\n  <title>&lt;TITLE</title>\n  <content mode="base64" type="&quot;TYPE">&lt;ENCODED</content>\n</entry>';
                return this.json = {
                    entry: {
                        $: { xmlns: 'http://purl.org/atom/ns#' },
                        title: { _: '<TITLE' },
                        content: {
                            $: {
                                mode: 'base64',
                                type: '"TYPE'
                            },
                            _: '<ENCODED'
                        }
                    }
                };
            });
            describe('_toJson', function () {
                return it('works', function (done) {
                    return Fotolife.prototype._toJson(this.xml).then(function (_this) {
                        return function (json) {
                            return assert.deepEqual(assert._expr(assert._capt(json, 'arguments/0'), {
                                content: 'assert.deepEqual(json, _this.json)',
                                filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                line: 603
                            }), assert._expr(assert._capt(assert._capt(_this, 'arguments/1/object').json, 'arguments/1'), {
                                content: 'assert.deepEqual(json, _this.json)',
                                filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                line: 603
                            }));
                        };
                    }(this)).then(function () {
                        return done();
                    }, done);
                });
            });
            return describe('_toXml', function () {
                return it('works', function (done) {
                    return Fotolife.prototype._toXml(this.json).then(function (_this) {
                        return function (xml) {
                            return assert(assert._expr(assert._capt(assert._capt(xml, 'arguments/0/left') === assert._capt(assert._capt(_this, 'arguments/0/right/object').xml, 'arguments/0/right'), 'arguments/0'), {
                                content: 'assert(xml === _this.xml)',
                                filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                line: 614
                            }));
                        };
                    }(this)).then(function () {
                        return done();
                    }, done);
                });
            });
        });
        return describe('multiple elements', function () {
            beforeEach(function () {
                this.xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<entry xmlns="http://purl.org/atom/ns#">\n  <title attr="ATTR1">&lt;TITLE1</title>\n  <title attr="ATTR2">&lt;TITLE2</title>\n</entry>';
                return this.json = {
                    entry: {
                        $: { xmlns: 'http://purl.org/atom/ns#' },
                        title: [
                            {
                                $: { attr: 'ATTR1' },
                                _: '<TITLE1'
                            },
                            {
                                $: { attr: 'ATTR2' },
                                _: '<TITLE2'
                            }
                        ]
                    }
                };
            });
            describe('_toJson', function () {
                return it('works', function (done) {
                    return Fotolife.prototype._toJson(this.xml).then(function (_this) {
                        return function (json) {
                            return assert.deepEqual(assert._expr(assert._capt(json, 'arguments/0'), {
                                content: 'assert.deepEqual(json, _this.json)',
                                filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                line: 650
                            }), assert._expr(assert._capt(assert._capt(_this, 'arguments/1/object').json, 'arguments/1'), {
                                content: 'assert.deepEqual(json, _this.json)',
                                filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                line: 650
                            }));
                        };
                    }(this)).then(function () {
                        return done();
                    }, done);
                });
            });
            return describe('_toXml', function () {
                return it('works', function (done) {
                    return Fotolife.prototype._toXml(this.json).then(function (_this) {
                        return function (xml) {
                            return assert(assert._expr(assert._capt(assert._capt(xml, 'arguments/0/left') === assert._capt(assert._capt(_this, 'arguments/0/right/object').xml, 'arguments/0/right'), 'arguments/0'), {
                                content: 'assert(xml === _this.xml)',
                                filepath: '/Users/bouzuya/.ghq/github.com/bouzuya/node-hatena-fotolife-api/test/fotolife.js',
                                line: 661
                            }));
                        };
                    }(this)).then(function () {
                        return done();
                    }, done);
                });
            });
        });
    });
});
