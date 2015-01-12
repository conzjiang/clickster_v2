Clickster.Views.TvIndexView = Backbone.View.extend({
  initialize: function () {
    this.tvShows = Clickster.currentUser.tvShows;
    this.allowed = Clickster.currentUser.get("is_admin") && this.tvShows;

    if (this.allowed) this.listenTo(this.tvShows, "add", this.render);
  },

  template: JST["tv_shows/index"],

  render: function () {
    if (this.allowed) {
      var content = this.template({
        tvs: this.tvShows,
        tvCard: JST["tv_shows/card"]
      });

      this.$el.html(content);
    } else {
      this.$el.html("You do not have access to this page.");
    }

    return this;
  }
});
