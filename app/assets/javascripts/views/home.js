Clickster.Views.HomeView = Backbone.View.extend({
  initialize: function () {
    this.useTvCards();

    this.listenTo(Clickster.currentUser, "sync", this.render);
    this.listenTo(Clickster.tvShows, "sync", this.render);
  },

  template: JST['home'],

  render: function () {
    var content = this.template({
      signedIn: !!Clickster.currentUser.id,
      shows: Clickster.tvShows.current()
    });

    this.$el.html(content);
    this.renderFeed();
    this.renderCards(Clickster.tvShows.current());
    return this;
  }
});
