Qliqster.FEED_CARD_SIZE = 220;

Qliqster.Views.FeedItemsListView = Backbone.View.extend({
  initialize: function () {
    this.feed = Qliqster.currentUser.feed;
    this.listenTo(this.feed, "newItem", this.renderFeedItem);
    this.listenToOnce(this.feed, "empty", this.displayRecommendations);
  },

  template: JST["feed/itemsList"],
  itemTemplate: JST["feed/item"],
  recommendationsTemplate: JST["feed/recommendations"],

  render: function () {
    var content = this.template();
    this.$el.html(content);

    this.feed.each(this.renderFeedItem.bind(this));
    this.feed.fetchNew();
    this.bindFeedEvents();

    return this;
  },

  renderFeedItem: function (item) {
    this.$("#recommendations").remove();
    this.$(".feed").prepend(this.itemTemplate({ item: item }));

    this.addLink();
    this.trimItems();
    this.$(".timeago").timeago();
  },

  addLink: function () {
    if (!this.$(".see-more").length && this.feed.length) {
      var link = "<a href=\"#/feed\" class=\"see-more\">View all</a>";
      this.$(".feed-wrapper").append(link);
    }
  },

  trimItems: function () {
    var $feedItems = this.$(".feed").children();

    if ($feedItems.length > Qliqster.NUM_TO_DISPLAY) {
      for (var i = $feedItems.length; i > Qliqster.NUM_TO_DISPLAY; i--) {
        $feedItems.eq(i - 1).remove();
      }
    }
  },

  bindFeedEvents: function () {
    if (this.interval) { return; }

    this.interval = setInterval(function () {
      this.feed.fetchNew();
    }.bind(this), 50000);
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
    }

    Backbone.View.prototype.remove.call(this);
  }
});
