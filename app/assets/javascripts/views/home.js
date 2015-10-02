Qliqster.Views.HomeView = Backbone.TvCardsView.extend({
  initialize: function () {
    this.listenTo(this.collection, "sync", this.render);
    this.listenTo(Qliqster.currentUser, "sync", this.render);
  },

  template: JST['home'],

  render: function () {
    var content = this.template({
      signedIn: Qliqster.currentUser.signedIn()
    });

    this.$el.html(content);

    this.renderFeed();
    this.renderCards();

    return this;
  },

  renderFeed: function (items) {
    if (!Qliqster.currentUser.signedIn()) return;
    if (this.feedView) this.feedView.remove();

    this.feedView = new Qliqster.Views.FeedItemsListView();
    this.$("#feed").html(this.feedView.render().$el);
  },

  remove: function () {
    this.feedView && this.feedView.remove();
    Backbone.View.prototype.remove.call(this);
  }
});
