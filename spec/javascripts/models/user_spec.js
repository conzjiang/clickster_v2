//= require application

describe("User model", function () {
  var userModel, currentUser, user, response;

  beforeEach(function () {
    userModel = Clickster.Models.User;
    currentUser = Clickster.currentUser = { id: 1 };
    user = new userModel({ id: 1, username: "conz" });
    response = {
      watchlists: [
        { id: 1, status: "Watching" },
        { id: 2, status: "Completed" },
        { id: 3, status: "Watching" }
      ],
      favorites: [{ id: 2 }]
    };

    user.parse(response);
  });

  it("initializes with a username", function () {
    expect(user.get("username")).to.equal("conz");
  });

  it("correctly assigns itself as the current user", function () {
    var otherUser = new userModel({ id: 2, username: "other" });

    expect(user.isCurrentUser).to.be.true;
    expect(otherUser.isCurrentUser).to.be.false;
  });

  it("correct url", function () {
    expect(user.url()).to.equal("/api/users/conz");
  });

  describe("#parse", function () {
    it("sets the correct collections when parsing", function () {
      expect(user.watchlists()).to.have.length(3);
      expect(user.favorites()).to.have.length(1);
    });

    it("deletes the parsed fields from the response", function () {
      expect(response).to.be.empty;
    });
  });

  describe("#watchlists & #favorites", function () {
    it("are instances of Lists", function () {
      [user.watchlists(), user.favorites()].forEach(function (collection) {
        expect(collection).to.be.an.instanceof(Clickster.Collections.Lists);
      });
    });

    it("always return the same collection", function () {
      expect(user.watchlists()).to.equal(user.watchlists());
      expect(user.favorites()).to.equal(user.favorites());
    });

    it("filters watchlists based on status", function () {
      var completed = user.watchlists("Completed");
      expect(completed).to.have.length(1);
      expect(completed[0].id).to.equal(2);
    });

    it("have respective count functions", function () {
      expect(user.watchNum()).to.equal(2);
      expect(user.favoriteCount()).to.equal(1);
    });
  });
});