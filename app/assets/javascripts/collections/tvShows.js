Clickster.Collections.TvShows = Backbone.Collection.extend({
  initialize: function (options) {
    if (options) this.user = options.user;
    this._requestedGenres = {};
  },

  comparator: function (model) {
    var title = model.get("title");

    if (/^The/.test(title)) {
      return title.match(/^The (.*)/)[1];
    }

    return title;
  },

  model: Clickster.Models.TvShow,

  url: 'api/tv_shows',

  admin: function () {
    var that = this;

    if (!this._fetchedAdmin) {
      this._fetchedAdmin = true;

      $.ajax({
        type: "get",
        url: this.url + "/admin",
        dataType: "json",
        success: function (data) {
          that.add(data);
          that.trigger("sync");
        }
      });
    }

    return this.filter(function (tv) {
      return tv.get("belongs_to_admin");
    });
  },

  byGenre: function (genre) {
    var that = this;

    if (!this._requestedGenres[genre]) {
      this._requestedGenres[genre] = true;

      $.ajax({
        type: "get",
        url: "api/genres/" + Utils.hyphenate(genre),
        dataType: "json",
        success: function (data) {
          that.add(data);
        }
      });
    }

    return this.filter(function (tv) {
      return tv.belongsTo(genre);
    });
  },

  current: function () {
    if (!this._requested) {
      this._requested = true;
      this.fetch();
    }

    return this.filter(function (tv) {
      return tv.get("status") === "Currently Airing";
    });
  }
});
