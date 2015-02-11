Clickster.Views.TvIndexView = Backbone.View.extend({
  initialize: function () {
    this.listenTo(Clickster.currentUser, "sync", this.render);
    this.listenTo(Clickster.tvShows, "sync", this.render);
  },

  template: JST["tv_shows/index"],

  render: function () {
    var isAdmin, tvShows;

    isAdmin = Clickster.currentUser.get("is_admin");

    if (isAdmin) {
      tvShows = Clickster.tvShows.admin();
      this.$el.html(this.template());
      this.useMiniCards(tvShows);
    } else {
      this.$el.html("You do not have access to this page.");
    }

    return this;
  }
});
