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
  },

  getOrFetch: function (id) {
    var tv = this.get(id);
    var that = this;

    if (!tv) {
      tv = new this.model({ id: id });
      tv.fetch({
        success: function () {
          that.add(tv);
        }
      });
    }

    return tv;
  }
});
