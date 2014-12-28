//= require spec_helper

describe("User show view", function () {
  var statuses, conz, view;

  beforeEach(function () {
    Clickster.currentUser = { id: 1 };
    statuses = Clickster.LIST_STATUSES = ["Watching", "Completed"];
    conz = new Clickster.Models.User({ id: 1, username: "conz" });
    view = new Clickster.Views.UserShowView({ user: conz });
  });

  it("displays `User not found` message if user not found", function () {
    conz.trigger("notFound");
    expect(view).to.have.content("User not found");
  });

  it("displays Edit link if current user", function () {
    view.render();
    expect(view).to.have.content("Edit");
  });

  it("does not display Edit link if not current user", function () {
    conz = new Clickster.Models.User({ id: 2, username: "conz" });
    view = new Clickster.Views.UserShowView({ user: conz });
    view.render();

    expect(view).to.have.content("conz");
    expect(view).not.to.have.content("Edit");
  });

  describe("#render", function () {
    it("renders user show template", function () {
      view.render();
      expect(view).to.have.content("conz");
    });

    it("renders user's watchlist and favorite shows", function () {
      conz.watchlists().add({
        tv_show_id: 1, status: "Watching", title: "Brooklyn 99"
      });
      view.render();

      expect(view).to.have.content("Watching");
      expect(view).to.have.content("Completed");
      expect(view).to.have.content("Favorites");
      expect(view).to.have.content("Brooklyn 99");
    });

    it("does not render template if user doesn't exist", function () {
      conz.notFound = true;
      view.render();

      expect(view).to.have.content("User not found");
      expect(view).not.to.have.content("conz");
    });
  });
});