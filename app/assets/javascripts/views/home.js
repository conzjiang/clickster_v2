Clickster.Views.HomeView = Backbone.View.extend({
  initialize: function () {
    this.useTvCards();

    this.listenTo(Clickster.currentUser, "sync", this.render);
    this.listenTo(Clickster.tvShows, "sync", this.render);
  },

  template: JST['home'],

  render: function () {
    var currentShows, content;

    currentShows = Clickster.tvShows.current();
    content = this.template({
      signedIn: !!Clickster.currentUser.id,
      shows: currentShows
    });

    this.$el.html(content);
    this.renderFeed();
    this.renderCards(currentShows);
    return this;
  }
});
