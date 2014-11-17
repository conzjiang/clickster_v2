Clickster.Collections.TvShows = Backbone.Collection.extend({
  model: Clickster.Model.TvShow,

  url: 'api/tv_shows',

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
