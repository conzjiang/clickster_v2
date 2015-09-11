Clickster.FEED_CARD_SIZE = 220;

Clickster.Views.FeedView = Backbone.View.extend({
  initialize: function () {
    this.feed = Clickster.currentUser.feed;
    this.listenTo(this.feed, "updated", this.renderFeedItems);
    this.listenToOnce(this.feed, "empty", this.displayRecommendations);
  },

  template: JST["feed"],
  itemTemplate: JST["feedItem"],
  recommendationsTemplate: JST["feedRecommendations"],

  render: function () {
    var content = this.template();
    this.$el.html(content);

    this.renderFeedItems();
    this.feed.fetchNew();

    return this;
  },

  renderFeedItems: function (items) {
    this.$("#recommendations").remove();

    var $feed = this.$(".feed");
    items = items || this.feed;
    if (items.length === 0) return;

    items.forEach(function (feedItem) {
      $feed.prepend(this.itemTemplate({ item: feedItem }));
    }.bind(this));

    this.trimItems();
    this.$(".timeago").timeago();
    this.bindFeedEvents();
  },

  trimItems: function () {
    var $feedItems = this.$(".feed").children();

    if ($feedItems.length > Clickster.NUM_TO_DISPLAY) {
      for (var i = $feedItems.length; i > Clickster.NUM_TO_DISPLAY; i--) {
        $feedItems.eq(i - 1).remove();
      }
    }
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

  displayRecommendations: function () {
    if (!this.feed.isEmpty()) return;

    var recommendations = this.recommendationsTemplate({
      recommendations: this.feed.recommendations()
    });

    this.$(".feed-wrapper").append(recommendations);
  },

  remove: function () {
    if (this.interval) {
      clearInterval(this.interval);
      Clickster.eventManager.offResize(this);
    }

    Backbone.View.prototype.remove.call(this);
  }
});
