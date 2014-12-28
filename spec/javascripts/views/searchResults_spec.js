//= require spec_helper

describe("Search Results view", function () {
  beforeEach(function () {
    setUpResultsDom();

    var tv = new Backbone.Model({ id: 1, title: "Brooklyn 99" });
    var conz = new Backbone.Model({
      id: 1,
      username: "conz"
    });

    _(conz).extend({
      watchNum: function() { return 3; },
      favoriteCount: function() { return 1; }
    });

    Clickster.searchResults = new Clickster.Collections.SearchResults([
      { params: "decade_ids=6", results: [tv] },
      {
        params: "text=conz",
        results: { text: true, tvResults: [], userResults: [conz] }
      }
    ]);
  });

  it("initializes with a model matching the given params", function () {
    var view = new Clickster.Views.SearchResultsView({
      params: "decade_ids=6"
    });

    expect(view.model).not.to.be.undefined;
  });

  it("given model always trumps given params", function () {
    var view = new Clickster.Views.SearchResultsView({
      model: new Backbone.Model({ id : 5 }),
      params: "decade_ids=6"
    });

    expect(view.model.id).to.equal(5);
  });

  describe("#render", function () {
    it("renders results", function () {
      var view = new Clickster.Views.SearchResultsView({
        params: "decade_ids=6"
      }).render();

      expect(view).to.have.content("Search Results");
      expect(view).to.have.content("Brooklyn 99");
    });

    it("renders two sections when text result", function () {
      var view = new Clickster.Views.SearchResultsView({
        params: "text=conz"
      }).render();

      expect(view).to.have.content("TV Show Results");
      expect(view).to.have.content("User Results");
      expect(view).to.have.content("conz");
    });
  });
});