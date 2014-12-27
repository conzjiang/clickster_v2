//= require application

describe("Home View", function () {
  var view;

  beforeEach(function () {
    Clickster.tvShows = new Clickster.Collections.TvShows();
    view = new Clickster.Views.HomeView();
  });

  it("renders the currently airing shows", function () {
    view.render();
    expect(view.$el.html()).to.have.string("Currently Airing");
  });
});