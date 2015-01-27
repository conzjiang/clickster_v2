Clickster.Models.TvShow = Backbone.Model.extend({
  initialize: function () {
    if (!this.get("genres")) this.set("genres", []);
  },

  urlRoot: "api/tv_shows",

  addToWatchlist: function (options) {
    this.sendData(this.url() + "/watchlist", {
      data: options.data,
      success: function (data) {
        var watchlists = Clickster.currentUser.watchlists();
        data.on_watchlist ? watchlists.add(this) : watchlists.remove(this);
        if (options && options.success) options.success();
      }.bind(this)
    });
  },

  sendData: function (url, options) {
    $.ajax({
      type: "post",
      url: url,
      data: options.data,
      dataType: "json",
      success: function (data) {
        this.set(data);
        if (options.success) options.success(data);
      }.bind(this)
    });
  },

  belongsTo: function (genre) {
    return this.get("genres").indexOf(genre) !== -1;
  },

  favorite: function (options) {
    this.sendData(this.url() + "/favorite", {
      success: function (data) {
        var favorites = Clickster.currentUser.favorites();
        data.is_favorite ? favorites.add(this) : favorites.remove(this);
        if (options && options.success) options.success();
      }
    });
  },

  setGenres: function (genreStr) {
    var genres = genreStr.split(", ");
    var that = this;

    this.set("genres", []);

    _(genres).each(function (genre) {
      var tvGenre;

      if (Clickster.GENRES.indexOf(genre) === -1) {
        tvGenre = _(Clickster.GENRES).find(function (dbGenre) {
          return dbGenre.match(genre);
        });
      } else {
        tvGenre = genre;
      }

      if (tvGenre) that.get("genres").push(tvGenre);
    });
  },

  setYears: function (yearStr) {
    var years = yearStr.split("–");
    this.set("start_year", parseInt(years[0]));

    if (years[1]) {
      this.set("end_year", parseInt(years[1]));
    } else {
      this.set("status", "Currently Airing");
    }
  },

  toJSON: function () {
    return { tv_show: this.attributes };
  }
});
