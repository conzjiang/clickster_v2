Clickster.FEED_CARD_SIZE = 220;

Clickster.Views.FeedView = Backbone.View.extend({
  initialize: function () {
    this.feed = Clickster.currentUser.feed;
    this.listenTo(this.feed, "updated", this.renderFeedItems);
  },

  template: JST["feed"],
  itemTemplate: JST["feedItem"],

  render: function () {
    var content = this.template();
    this.$el.html(content);

    if (this.feed.isEmpty()) {
      this.feed.fetchNew();
    } else {
      this.renderFeedItems();
    }

    return this;
  },

  renderFeedItems: function (items) {
    var $feed = this.$(".feed");
    items = items || this.feed;

    items.forEach(function (feedItem) {
      $feed.prepend(this.itemTemplate({ item: feedItem }));
    }.bind(this));

    this.$(".timeago").timeago();
    this.bindFeedEvents();
  },

  bindFeedEvents: function () {
    if (this.interval) { return; }

    this.interval = setInterval(function () {
      this.feed.fetchNew();
    }.bind(this), 50000);

    this.resizeFeedWrapper();
    Clickster.eventManager.onResize(this.resizeFeedWrapper, this);
  },

  resizeFeedWrapper: function () {
    if ($(window).width() > 500) {
      this.$(".feed").css({
        width: this.feed.length * Clickster.FEED_CARD_SIZE + "px"
      });
    } else {
      this.$(".feed").removeAttr("style");
    }
  },

  remove: function () {
    if (this.interval) {
      clearInterval(this.interval);
      Clickster.eventManager.offResize(this);
    }

    Backbone.View.prototype.remove.call(this);
  }
});
