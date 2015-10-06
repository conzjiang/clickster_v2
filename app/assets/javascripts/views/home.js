Qliqster.Views.HomeView = Backbone.TvCardsView.extend({
  initialize: function () {
    this.listenTo(this.collection, "sync", this.renderCards);

    this.listenToOnce(Qliqster.currentUser, "sync", function () {
      this.$('ul.tv-results').empty();
      this.collection.fetch();
      this.render();
    });
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
    this.$("#feed").html(this.feedView.$el);
    this.feedView.render();
  },

  remove: function () {
    this.feedView && this.feedView.remove();
    Backbone.View.prototype.remove.call(this);
  }
});
