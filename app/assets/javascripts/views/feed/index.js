Clickster.Views.FeedIndexView = Backbone.View.extend({
  initialize: function () {
    this.feed = Clickster.currentUser.feed;
    this.feed.fetch();
    this.bindEvents();

    this.listenTo(Clickster.currentUser, 'sync', this.render);
    this.listenTo(this.feed, 'sync', this.render);
    this.listenTo(this.feed, 'newItem', this.renderFeedItem);
    this.listenTo(this.feed, 'empty', this.displayRecommendations);
  },

  template: JST["feed/index"],
  itemTemplate: JST["feed/item"],
  recommendationsTemplate: JST["feed/recommendations"],

  render: function () {
    if (Clickster.currentUser.signedIn()) {
      var content = this.template();
      this.$el.html(content);
      this.feed.each(this.renderFeedItem.bind(this));
    } else {
      this.$el.html("Please sign in first.");
    }

    return this;
  },

  bindEvents: function () {
    if (this.interval) return;

    this.interval = setInterval(function () {
      this.feed.fetchNew()
    }.bind(this), 50000);
  },

  renderFeedItem: function (item) {
    this.$("#recommendations").remove();

    this.$(".feed-index-list").prepend(this.itemTemplate({
      item: item
    }));

    this.$(".timeago").timeago();
  },

  displayRecommendations: function () {
    if (!this.feed.isEmpty()) return;

    var recommendations = this.recommendationsTemplate({
      recommendations: this.feed.recommendations()
    });

    this.$el.append(recommendations);
  },

  remove: function () {
    if (this.interval) clearInterval(this.interval);
    Backbone.View.prototype.remove.call(this);
  }
});
