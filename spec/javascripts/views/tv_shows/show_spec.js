//= require spec_helper

describe("TV show view", function () {
  var view;

  beforeEach(function () {
    var tv = new Qliqster.Models.TvShow({ title: "The Comeback" });
    Qliqster.currentUser = new Qliqster.Models.CurrentUser({ id: 1 });
    view = new Qliqster.Views.TvShowView({ tv: tv });
  });

  describe("#toggleOptions", function () {
    it("doesn't allow toggling if not signed in", function () {
      view.render();
      Qliqster.currentUser = {};
      view.toggleOptions();

      expect(view.$("ul.show")).to.have.length(0);
    });
  });

  describe("#hideOptions", function () {
    it("doesn't toggle options if options already hidden", function () {
      view.render();
      view.hideOptions();

      expect(view.$("ul.show")).to.have.length(0);
    });
  });

  describe("#render", function () {
    it("renders TV show template", function () {
      view.render();
      expect(view).to.have.content("The Comeback");
    });
  });
});