//= require spec_helper

describe("TV index view", function () {
  var view, currentUser;

  beforeEach(function () {
    currentUser = Qliqster.currentUser = new Qliqster.Models.CurrentUser();
    currentUser.set("is_admin", true);
    currentUser.tvShows = new Backbone.Collection([
      { id: 1, title: "Brooklyn 99" }
    ]);

    view = new Qliqster.Views.TvIndexView();
  });

  it("renders TV shows that current user admins", function () {
    view.render();

    expect(view).to.have.content("My Series");
    expect(view).to.have.content("Brooklyn 99");
  });

  it("doesn't render page when current user isn't admin", function () {
    Qliqster.currentUser = new Backbone.Model();
    view = new Qliqster.Views.TvIndexView();
    view.render();

    expect(view).to.have.content("You do not have access");
    expect(view).not.to.have.content("My Series");
  });
});