//= require spec_helper

describe("TvShows collection", function () {
  var tvs;

  beforeEach(function () {
    tvs = new Clickster.Collections.TvShows([
      { id: 1, title: "Brooklyn Nine-Nine", genres: ["Comedy"] },
      { id: 2, title: "Orphan Black", genres: ["Drama"] },
      { id: 3, title: "Arrested Development", genres: ["Comedy"] }
    ]);
  });

  it("initializes with an empty requestedGenres object", function () {
    expect(tvs._requestedGenres).to.be.empty;
  });

  it("sorts by title", function () {
    expect(tvs.pluck("id")).to.eql([3, 1, 2]);
  });

  it("excludes leading `The`s in title when sorting", function () {
    tvs.add({ id: 4, title: "The Comeback" });
    expect(tvs.pluck("id")).to.eql([3, 1, 4, 2]);
  });

  describe("#byGenre", function () {
    beforeEach(function () {
      sinon.stub($, "ajax").yieldsTo("success", [
        { id: 2 },
        { id: 5, title: "Mad Men", genres: ["Drama"] }
      ]);
    });

    afterEach(function () {
      $.ajax.restore();
    });

    it("finds all the TV shows of the specified genre", function () {
      // have to call twice because it syncs by the second call
      tvs.byGenre("Drama");
      var dramaIds = tvs.byGenre("Drama").map(function(tv) { return tv.id; });

      expect(dramaIds).to.include.members([2, 5]);
    });

    it("only makes an ajax call once by caching the search", function () {
      tvs.byGenre("Drama");
      tvs.byGenre("Drama");

      expect($.ajax.calledOnce).to.be.true;
      expect(tvs._requestedGenres).not.to.be.empty;
    });
  });

  describe("#current", function () {
    var server;

    before(function () {
      server = sinon.fakeServer.create();
      server.respondWith("GET", "api/tv_shows", [
        200, { "Content-Type": "application/json" },
        JSON.stringify([
          { id: 4, title: "The Comeback", status: "Currently Airing" }
        ])
      ]);
    });

    after(function () {
      server.restore();
    });

    it("returns all currently airing shows", function () {
      tvs.current();
      server.respond();

      expect(tvs.current()).to.have.length(1);
      expect(tvs.current()[0].id).to.equal(4);
    });

    it("only fetches once regardless of frequency of calls", function () {
      tvs.current();
      server.respond();
      tvs.current();

      expect(tvs._requested).to.be.true;
    });
  });

  describe("#getOrFetch", function () {
    var server;

    before(function () {
      server = sinon.fakeServer.create();
    });

    after(function () {
      server.restore();
    });

    it("returns a matching TV show if in collection", function () {
      expect(tvs.getOrFetch(1).get("title")).to.equal("Brooklyn Nine-Nine");
    });

    it("gets one from the database otherwise", function () {
      server.respondWith("GET", "api/tv_shows/4", [
        200, { "Content-Type": "application/json" }, JSON.stringify({
          id: 4, title: "The Comeback"
        })
      ]);

      var comeback = tvs.getOrFetch(4);
      server.respond();

      expect(comeback.get("title")).to.equal("The Comeback");
    });
  });
});