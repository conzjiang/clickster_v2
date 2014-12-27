//= require application

describe("TvShow model", function () {
  var tvShow, user;

  beforeEach(function () {
    tvShow = new Clickster.Models.TvShow({ id: 1 });
    user = Clickster.currentUser = new Clickster.Models.CurrentUser();
  });

  it("initializes genres with an empty array", function () {
    expect(tvShow.get("genres")).to.eql([]);
  });

  it("knows which genres it belongs to", function () {
    tvShow.set({ genres: ["Comedy", "Live-Action", "Scripted"] });
    expect(tvShow.belongsTo("Comedy")).to.be.true;
    expect(tvShow.belongsTo("Drama")).to.be.false;
  });

  it("knows if favorited by current user", function () {
    expect(tvShow.isFavorite()).to.be.false;

    user.favorites().set({ tv_show_id: tvShow.id });
    expect(tvShow.isFavorite()).to.be.true;
  });

  describe("#onWatchlist", function () {
    it("knows if it's on the current user's watchlist", function () {
      expect(tvShow.onWatchlist()).to.be.false;

      user.watchlists().set({ tv_show_id: tvShow.id });
      expect(tvShow.onWatchlist()).to.be.true;
    });

    it("sets watchStatus when function is called", function () {
      user.watchlists().set({ tv_show_id: tvShow.id, status: "Dropped" });
      tvShow.onWatchlist();

      expect(tvShow.watchStatus).to.equal("Dropped");
    });
  });

  describe("#setGenres", function () {
    beforeEach(function () {
      Clickster.GENRES = ["Comedy", "Drama", "Romance", "Sci-Fi/Fantasy"];
    });

    it("sets its genres based on the given string of genres", function () {
      tvShow.setGenres("Drama, Romance");
      expect(tvShow.get("genres")).to.eql(["Drama", "Romance"]);
    });

    it("doesn't set genres that aren't in the master list", function () {
      tvShow.setGenres("Science, Comedy");
      expect(tvShow.get("genres")).to.eql(["Comedy"]);
    });

    it("assigns matching genre from master list", function () {
      tvShow.setGenres("Fantasy");
      expect(tvShow.get("genres")).to.eql(["Sci-Fi/Fantasy"]);
    });
  });

  describe("#setYears", function () {
    it("sets start and end years", function () {
      tvShow.setYears("2010–2014");
      expect(tvShow.get("start_year")).to.equal(2010);
      expect(tvShow.get("end_year")).to.equal(2014);
    });

    it("sets status to Currently Airing when no end year", function () {
      tvShow.setYears("2010–");
      expect(tvShow.get("start_year")).to.equal(2010);
      expect(tvShow.get("end_year")).to.be.undefined;
      expect(tvShow.get("status")).to.equal("Currently Airing");
    });
  });
});