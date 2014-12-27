//= require spec_helper

describe("SearchResults collection", function () {
  var results;

  beforeEach(function () {
    setUpResultsDom();

    results = new Clickster.Collections.SearchResults([
      { params: "abc", results: [1, 2, 3] }
    ]);
  });

  it("initializes with bootstrapped TV shows and users", function () {
    expect(results.tvShows).to.have.length(3);
    expect(results.users).to.have.length(2);
  });

  describe("#addTextResult", function () {
    beforeEach(function () {
      var comeback = new Backbone.Model({ id: 4, title: "The Comeback" });
      results.addTextResult(comeback);
    });

    it("adds TV shows to its results list", function () {
      expect(results.tvShows).to.have.length(4);
    });

    it("strips down their titles", function () {
      expect(_(results.tvShows).last().pattern).to.equal("thecomeback");
    });
  });

  describe("#getOrFetch", function () {
    before(function () {
      Clickster.tvShows = new Backbone.Collection();
      Clickster.users = new Backbone.Collection();
    });

    it("returns the result with the specified params", function () {
      expect(results.getOrFetch("abc").get("results")).to.eql([1, 2, 3]);
    });

    it("queries database if result not in collection", function () {
      var result;
      sinon.stub($, "ajax");
      result = results.getOrFetch("genre=Drama&status=Current");

      expect($.ajax.calledOnce).to.be.true;
      $.ajax.restore();
    });

    it("sets text property on results when given text param", function () {
      var textResult;
      sinon.stub($, "ajax").yieldsTo("success", {
        tv_results: [],
        user_results: [{ id: 1, username: "conz" }]
      });

      textResult = results.getOrFetch("text=conz");

      expect(textResult.get("results")).to.have.ownProperty("text");
      $.ajax.restore();
    });
  });

  describe("#include", function () {
    it("checks if a TV show already has the given title", function () {
      expect(results.include("Orphan Black")).to.be.true;
    });

    it("checks against lowercased titles", function () {
      expect(results.include("orphan black")).to.be.true;
    });

    it("adds a lowercase property to its tvShows list", function () {
      results.include("jjj");
      expect(results.tvShows.lowercase).not.to.be.undefined;
    });

    it("doesn't match partial titles", function () {
      expect(results.include("Orphan")).to.be.false;
    });
  });

  describe("#processText", function () {
    it("returns TV show and user ids that match query", function () {
      expect(results.processText("pizza")).to.eql({ tvIds: [3], userIds: [2] });
    });
  });
});