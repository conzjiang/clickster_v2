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
        if (options.success) options.success(data);
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

  favorite: function (options) {
    this.sendData(this.url() + "/favorite", {
      success: function (data) {
        var favorites = Clickster.currentUser.favorites();
        data.is_favorite ? favorites.add(this) : favorites.remove(this);
        if (options && options.success) options.success(data);
      }.bind(this)
    });
  },

  fetchWatchCounts: function () {
    $.ajax({
      method: "GET",
      url: this.url() + "/watch_counts",
      dataType: "json",
      success: function (data) {
        this.setWatchCounts(data.watch_counts);
        this._watchers = {};
        this.trigger("watchCounts");
      }.bind(this)
    });
  },

  parse: function (resp) {
    if (resp.watch_counts) {
      this.setWatchCounts(resp.watch_counts);
      delete resp.watch_counts;
    }

    return resp;
  },

  setGenres: function (genreStr) {
    var genres = genreStr.split(", ");
    var that = this;

    this.set("genres", []);

    _(genres).each(function (genre) {
      var tvGenre, dbGenre;

      if (Utils.isGenre(genre)) {
        tvGenre = genre;
      } else {
        tvGenre = Utils.matchGenre(genre);
      }

      if (tvGenre) that.get("genres").push(tvGenre);
    });
  },

  setWatchCounts: function (watchCounts) {
    this._watchCounts = watchCounts;
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
    return { tv_show: _.clone(this.attributes) };
  },

  watchCounts: function () {
    return this._watchCounts || {};
  },

  watchers: function (watchStatus) {
    this._watchers = this._watchers || {};

    if (!this._watchers[watchStatus]) {
      this._watchers[watchStatus] = new Clickster.Collections.Watchers([], {
        tv: this,
        watchStatus: watchStatus
      });

      this._watchers[watchStatus].fetch();
    }

    return this._watchers[watchStatus];
  }
});
