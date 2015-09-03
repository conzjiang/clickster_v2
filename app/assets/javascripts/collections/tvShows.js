Clickster.Collections.TvShows = Backbone.Collection.extend({
  initialize: function (models, options) {
    this.url = options.url;
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

  byGenre: function (genre) {
    var that = this;

    if (!this._requestedGenres[genre]) {
      this._requestedGenres[genre] = [];

      $.ajax({
        type: "get",
        url: "api/genres/" + Utils.hyphenate(genre),
        dataType: "json",
        success: function (data) {
          this._requestedGenres[genre] = that.add(data);
        }.bind(this)
      });
    }

    return _(this._requestedGenres[genre]).sortBy(this.comparator);
  }
});
