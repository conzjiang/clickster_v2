Clickster.Views.TvIndex = Backbone.View.extend({
  initialize: function () {
    this.tvShows = Clickster.currentUser.tvShows();

    this.listenTo(this.tvShows, "sync", this.render);
  },

  template: JST["tv_shows/index"],

  render: function () {
    var content = this.template({ tvs: this.tvShows });
    this.$el.html(content);
    return this;
  }
});
