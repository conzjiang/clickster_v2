Clickster.Views.TvIndexView = Backbone.MiniCardsView.extend({
  initialize: function () {
    this.listenTo(this.collection, "sync", this.render);
    this.listenTo(Clickster.currentUser, "sync", this.render);
  },

  template: JST["tv_shows/index"],

  render: function () {
    if (Clickster.currentUser.get("is_admin")) {
      this.$el.html(this.template());
      this.renderMiniCards();
    } else {
      this.$el.html("You do not have access to this page.");
    }

    return this;
  }
});
