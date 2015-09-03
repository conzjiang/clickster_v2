Clickster.Collections.TvShows = Backbone.Collection.extend({
  initialize: function (models, options) {
    this.url = options && options.url;
  },

  comparator: function (model) {
    var title = model.get("title");

    if (/^The/.test(title)) {
      return title.match(/^The (.*)/)[1];
    }

    return title;
  }
});
