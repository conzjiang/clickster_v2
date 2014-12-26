//= require application

describe("User model", function () {
  it("initializes with a username", function () {
    Clickster.currentUser = {};
    var user = new Clickster.Models.User({ username: "conz" });
    expect(user.get("username")).to.equal("conz");
  });

  it("correctly assigns itself as the current user", function () {
    Clickster.currentUser = { id: 1 };
    var user = new Clickster.Models.User({ username: "conz", id: 1 });
    expect(user.isCurrentUser).to.be.true;
  });
});