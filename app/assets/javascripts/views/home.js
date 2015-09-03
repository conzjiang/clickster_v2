Clickster.Views.HomeView = Backbone.TvCardsView.extend({
  initialize: function () {
    this.listenTo(Clickster.tvShows, "sync", this.render);
    this.listenTo(Clickster.currentUser, "sync", this.render);
  },

  template: JST['home'],

  render: function () {
    var content = this.template({
      signedIn: Clickster.currentUser.signedIn()
    });

    this.$el.html(content);

    this.renderFeed();
    this.renderCards(Clickster.tvShows.current());

    return this;
  },

  onRender: function () {
    this.feedView && this.feedView.onRender && this.feedView.onRender();
  },

  renderFeed: function (items) {
    if (!Clickster.currentUser.signedIn()) return;
    if (this.feedView) this.feedView.remove();

    this.feedView = new Clickster.Views.FeedView();
    this.$("#feed").html(this.feedView.render().$el);
  },

  remove: function () {
    this.feedView && this.feedView.remove();
    Backbone.View.prototype.remove.call(this);
  }
});
