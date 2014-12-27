//= require spec_helper

describe("Users collection", function () {
  var users;

  beforeEach(function () {
    Clickster.currentUser = {};
    users = new Clickster.Collections.Users([
      { id: 1, username: "conz" },
      { id: 2, username: "pizza" }
    ]);
  });

  it("User model", function () {
    expect(users.first()).to.be.an.instanceof(Clickster.Models.User);
  });

  describe("#getOrFetch", function () {
    it("returns a matching user if in collection", function () {
      expect(users.getOrFetch("conz").id).to.equal(1);
    });

    it("gets one from the database otherwise", function () {
      var server = sinon.fakeServer.create();
      server.respondWith("GET", "/api/users/bunny", [
        200, { "Content-Type": "application/json" }, '{ "id": 3 }'
      ]);

      var bunny = users.getOrFetch("bunny");
      server.respond();

      expect(bunny.id).to.equal(3);
    });

    it("sets a notFound property if user doesn't exist", function () {
      var server = sinon.fakeServer.create();
      server.respondWith("GET", "/api/users/bunny", [
        404, { "Content-Type": "application/json" }, ""
      ]);

      var alien = users.getOrFetch("alien");
      server.respond();

      expect(alien.notFound).to.be.true;
    });
  });
});