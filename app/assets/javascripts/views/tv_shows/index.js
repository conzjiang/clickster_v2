Clickster.Views.TvIndexView = Backbone.View.extend({
  initialize: function () {
    this.tvShows = Clickster.currentUser.tvShows();

    this.listenTo(Clickster.currentUser, "sync", this.render);
    this.listenTo(Clickster.tvShows, "add", this.render);
  },

  template: JST["tv_shows/index"],

  render: function () {
    var isAdmin = Clickster.currentUser.get("is_admin");

    if (isAdmin) {
      this.$el.html(this.template());
      this.useMiniCards(this.tvShows);
    } else {
      this.$el.html("You do not have access to this page.");
    }

    return this;
  }
});
