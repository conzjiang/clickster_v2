//= require application

describe("CurrentUser model", function () {
  var currentUser, response;

  beforeEach(function () {
    currentUser = new Clickster.Models.CurrentUser({ id: 1 });
    response = {
      watchlists: [{ id: 1 }],
      tv_shows: [{ id: 3 }, { id: 4 }]
    };

    currentUser.parse(response);
    currentUser.set("is_admin", true);
  });

  it("inherits from User model", function () {
    expect(currentUser).to.be.an.instanceof(Clickster.Models.User);
  });

  it("correctly identifies as the current user", function () {
    expect(currentUser.isCurrentUser).to.be.true;
  });

  it("correct url", function () {
    expect(currentUser.url).to.equal("api/current_user");
  });

  describe("#parse", function () {
    it("parses TV shows", function () {
      expect(currentUser.tvShows).to.have.length(2);
    });

    it("extends User#parse", function () {
      expect(currentUser.watchlists()).not.to.be.empty;
    });
  });

  describe("#isAdmin", function () {
    it("checks if user is the admin of a TV show", function () {
      expect(currentUser.isAdmin({ id: 3 })).to.be.true;
      expect(currentUser.isAdmin({ id: 1 })).to.be.false;
    });

    it("always returns false if not admin", function () {
      currentUser.set("is_admin", false);
      expect(currentUser.isAdmin({ id: 3 })).to.be.false;
    });
  });
});