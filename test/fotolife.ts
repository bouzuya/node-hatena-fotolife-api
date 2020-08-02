import { Test, test } from "beater";
import path from "path";
import assert from "power-assert";
import sinon from "sinon";
import { Fotolife } from "../src/fotolife";

const category = "/fotolife ";
const tests: Test[] = [
  test(category + "constructor (wsse)", () => {
    const fotolife = new Fotolife({
      apikey: "apikey",
      username: "username",
    });
    assert((fotolife as any)._type === "wsse");
    assert((fotolife as any)._username === "username");
    assert((fotolife as any)._apikey === "apikey");
  }),

  test(category + "constructor (oauth)", () => {
    const fotolife = new Fotolife({
      accessToken: "accessToken",
      accessTokenSecret: "accessTokenSecret",
      consumerKey: "consumerKey",
      consumerSecret: "consumerSecret",
      type: "oauth",
    });
    assert((fotolife as any)._type === "oauth");
    assert((fotolife as any)._accessToken === "accessToken");
    assert((fotolife as any)._accessTokenSecret === "accessTokenSecret");
    assert((fotolife as any)._consumerKey === "consumerKey");
    assert((fotolife as any)._consumerSecret === "consumerSecret");
  }),

  test(category + "create (happy path)", () => {
    const request = sinon.stub().returns(Promise.resolve());
    (Fotolife.prototype as any)._request = request;
    const fotolife = new Fotolife({
      apikey: "apikey",
      type: "wsse",
      username: "username",
    });
    return fotolife
      .create({ file: path.resolve(__dirname, "./bouzuya.png") })
      .then((_) => {
        assert(request.callCount === 1);
        assert(request.getCall(0).args[0].method === "post");
        assert(request.getCall(0).args[0].path === "/atom/post");
        const body = request.getCall(0).args[0].body;
        assert(body.entry.title._ === "");
        assert(body.entry.content.$.type === "image/png");
        assert(typeof body.entry["dc:subject"] === "undefined");
        assert(typeof body.entry.generator === "undefined");
      });
  }),

  test(category + "create (with all options)", () => {
    const request = sinon.stub().returns(Promise.resolve());
    (Fotolife.prototype as any)._request = request;
    const fotolife = new Fotolife({
      apikey: "apikey",
      type: "wsse",
      username: "username",
    });
    return fotolife
      .create({
        file: path.resolve(__dirname, "./bouzuya.png"),
        folder: "FOLDER",
        generator: "GENERATOR",
        title: "TITLE",
        type: "TYPE",
      })
      .then((_) => {
        assert(request.callCount === 1);
        assert(request.getCall(0).args[0].method === "post");
        assert(request.getCall(0).args[0].path === "/atom/post");
        const body = request.getCall(0).args[0].body;
        assert(body.entry.title._ === "TITLE");
        assert(body.entry.content.$.type === "TYPE");
        assert(body.entry["dc:subject"]._ === "FOLDER");
        assert(body.entry.generator._ === "GENERATOR");
      });
  }),

  test(category + "create (file does not exist)", () => {
    const request = sinon.stub().returns(Promise.resolve());
    (Fotolife.prototype as any)._request = request;
    const fotolife = new Fotolife({
      apikey: "apikey",
      type: "wsse",
      username: "username",
    });
    return fotolife.create({ file: "noexists" }).then(
      () => assert.fail(),
      (error) => {
        assert(request.callCount === 0);
        assert(error instanceof Error);
      }
    );
  }),

  test(category + "update (with all options)", () => {
    const request = sinon.stub().returns(Promise.resolve());
    (Fotolife.prototype as any)._request = request;
    const fotolife = new Fotolife({
      apikey: "apikey",
      type: "wsse",
      username: "username",
    });
    return fotolife.update({ id: 123, title: "TITLE" }).then((_) => {
      assert(request.callCount === 1);
      assert(request.getCall(0).args[0].method === "put");
      assert(request.getCall(0).args[0].path === "/atom/edit/123");
      const body = request.getCall(0).args[0].body;
      assert(body.entry.title._ === "TITLE");
    });
  }),

  test(category + "destroy (with all options)", () => {
    const request = sinon.stub().returns(Promise.resolve());
    (Fotolife.prototype as any)._request = request;
    const fotolife = new Fotolife({
      apikey: "apikey",
      type: "wsse",
      username: "username",
    });
    return fotolife.destroy({ id: 123 }).then((_) => {
      assert(request.callCount === 1);
      assert(request.getCall(0).args[0].method === "delete");
      assert(request.getCall(0).args[0].path === "/atom/edit/123");
    });
  }),

  test(category + "show", () => {
    const request = sinon.stub().returns(Promise.resolve());
    (Fotolife.prototype as any)._request = request;
    const fotolife = new Fotolife({
      apikey: "apikey",
      type: "wsse",
      username: "username",
    });
    return fotolife.show({ id: 123 }).then((_) => {
      assert(request.callCount === 1);
      assert(request.getCall(0).args[0].method === "get");
      assert(request.getCall(0).args[0].path === "/atom/edit/123");
    });
  }),

  test(category + "index", () => {
    const request = sinon.stub().returns(Promise.resolve());
    (Fotolife.prototype as any)._request = request;
    const fotolife = new Fotolife({
      apikey: "apikey",
      type: "wsse",
      username: "username",
    });
    return fotolife.index().then((_) => {
      assert(request.callCount === 1);
      assert(request.getCall(0).args[0].method === "get");
      assert(request.getCall(0).args[0].path === "/atom/feed");
    });
  }),
];

export { tests };
