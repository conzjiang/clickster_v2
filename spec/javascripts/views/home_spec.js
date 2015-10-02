//= require spec_helper

describe("Home View", function () {
  var view;

  beforeEach(function () {
    Qliqster.tvShows = new Qliqster.Collections.TvShows();
    view = new Qliqster.Views.HomeView();
  });

  it("renders the currently airing shows", function () {
    view.render();
    expect(view).to.have.content("Currently Airing");
  });
});