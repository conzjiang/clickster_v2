Clickster.Views.TvIndex = Backbone.View.extend({
  initialize: function () {
    this.tvShows = Clickster.currentUser.tvShows();

    this.listenTo(this.tvShows, "add", this.render);
  },

  template: JST["tv_shows/index"],

  render: function () {
    var content = this.template({
      tvs: this.tvShows,
      tvCard: JST["tv_shows/card"]
    });

    this.$el.html(content);
    this.$(".content").dotdotdot();

    return this;
  }
});
