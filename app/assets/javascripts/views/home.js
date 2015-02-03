Clickster.Views.HomeView = Backbone.View.extend({
  initialize: function () {
    this.feed = Clickster.currentUser.feed;
    this.useTvCards();

    this.listenTo(Clickster.currentUser, "sync", this.render);
    this.listenTo(Clickster.tvShows, "sync", this.render);
    this.listenTo(this.feed, "update", this.renderFeed);
  },

  template: JST['home'],

  render: function () {
    var currentShows, signedIn, content;

    currentShows = Clickster.tvShows.current();
    signedIn = !!Clickster.currentUser.id;
    content = this.template({
      signedIn: signedIn,
      shows: currentShows
    });

    this.$el.html(content);
    if (signedIn) this.feed.fetchNew();
    this.renderCards(currentShows);
    return this;
  },

  renderFeed: function (items) {
    var itemTemplate = JST["feedItem"],
        $feed = this.$(".feed");

    _(items).each(function (feedItem) {
      var $item = itemTemplate({ item: feedItem });
      $feed.prepend($item);
    });

    $(".timeago").timeago();
    this.setFeedUpdateInterval();
  },

  setFeedUpdateInterval: function () {
    if (!this.interval) {
      this.interval = setInterval(function () {
        this.feed.fetchNew();
      }.bind(this), 50000);
    }
  },

  remove: function () {
    if (this.interval) clearInterval(this.interval);
    Backbone.View.prototype.remove.call(this);
  }
});
