//= require spec_helper

describe("Users collection", function () {
  var users;

  beforeEach(function () {
    Qliqster.currentUser = {};
    users = new Qliqster.Collections.Users([
      { id: 1, username: "conz" },
      { id: 2, username: "pizza" }
    ]);
  });

  describe("#getOrFetch", function () {
    var server;

    before(function () {
      server = sinon.fakeServer.create();
    });

    after(function () {
      server.restore();
    });

    it("returns a matching user if in collection", function () {
      expect(users.getOrFetch("conz").id).to.equal(1);
    });

    it("gets one from the database otherwise", function () {
      server.respondWith("GET", "/api/users/bunny", [
        200, { "Content-Type": "application/json" }, '{ "id": 3 }'
      ]);

      var bunny = users.getOrFetch("bunny");
      server.respond();

      expect(bunny.id).to.equal(3);
    });

    it("sets a notFound property if user doesn't exist", function () {
      server.respondWith("GET", "/api/users/bunny", [
        404, { "Content-Type": "application/json" }, ""
      ]);

      var alien = users.getOrFetch("alien");
      server.respond();

      expect(alien.notFound).to.be.true;
    });
  });
});