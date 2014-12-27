//= require application

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
    expect(view.$el.html()).to.have.string("User not found");
  });

  it("displays Edit link if current user", function () {
    view.render();
    expect(view.$el.html()).to.have.string("Edit");
  });

  it("does not display Edit link if not current user", function () {
    conz = new Clickster.Models.User({ id: 2, username: "conz" });
    view = new Clickster.Views.UserShowView({ user: conz });
    view.render();

    expect(view.$el.html()).to.have.string("conz");
    expect(view.$el.html()).not.to.have.string("Edit");
  });

  describe("#render", function () {
    it("renders user show template", function () {
      view.render();
      expect(view.$el.html()).to.have.string("conz");
    });

    it("renders user's watchlist and favorite shows", function () {
      conz.watchlists().add({
        tv_show_id: 1, status: "Watching", title: "Brooklyn 99"
      });
      view.render();

      expect(view.$el.html()).to.have.string("Watching");
      expect(view.$el.html()).to.have.string("Completed");
      expect(view.$el.html()).to.have.string("Favorites");
      expect(view.$el.html()).to.have.string("Brooklyn 99");
    });

    it("does not render template if user doesn't exist", function () {
      conz.notFound = true;
      view.render();

      expect(view.$el.html()).to.have.string("User not found");
      expect(view.$el.html()).not.to.have.string("conz");
    });
  });
});