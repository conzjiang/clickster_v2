//= require spec_helper

describe("SearchResult model", function () {
  var result, tvs;

  beforeEach(function () {
    tvs = Clickster.tvShows = new Backbone.Collection();
    result = new Clickster.Models.SearchResult();
    result.url = function() { return "/"; };
  });

  describe("#runQuery", function () {
    beforeEach(function () {
      sinon.stub($, "ajax").yieldsTo("success", [
        { id: 1 },
        { id: 2 }
      ]);

      result.runQuery();
    });

    afterEach(function () {
      $.ajax.restore();
    });

    it("makes an ajax request", function () {
      expect($.ajax.calledOnce).to.be.true;
    });

    it("sets its results to an array of matching models", function () {
      expect(result.get("results")).to.have.length(2);
    });

    it("adds the models to the master TV show collection", function () {
      expect(tvs).to.have.length(2);
    });
  });

  describe("#sortBy", function () {
    it("sorts the results by the given comparator", function () {
      result.set("results", [
        { id: 2, title: "X" },
        { id: 1, title: "Z" },
        { id: 3, title: "Y" }
      ]);

      expect(result.sortBy("title")).to.eql([
        { id: 2, title: "X" },
        { id: 3, title: "Y" },
        { id: 1, title: "Z" }
      ]);
    });
  });

  describe("#textSearch", function () {
    var users;

    beforeEach(function () {
      users = Clickster.users = new Backbone.Collection();

      sinon.stub($, "ajax").yieldsTo("success", {
        tv_results: [{ id: 1 }],
        user_results: [{ id: 2 }]
      });

      result.textSearch({ tvIds: [1], userIds: [2] });
    });

    afterEach(function () {
      $.ajax.restore();
    });

    it("sets its results object `text` property", function () {
      expect(result.get("results").text).to.be.true;
    });

    it("filters the results into their respective collections", function () {
      expect(result.get("results").tvResults).to.eql(tvs.models);
      expect(result.get("results").userResults).to.eql(users.models);
    });
  });
});