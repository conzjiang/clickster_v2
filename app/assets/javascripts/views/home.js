Clickster.Views.HomeView = Backbone.TvCardView.extend({
  initialize: function () {
    this.feed = Clickster.currentUser.feed;

    this.listenTo(Clickster.currentUser, "sync", this.render);
    this.listenTo(this.feed, "update", this.renderFeed);
  },

  template: JST['home'],

  render: function () {
    var currentShows, signedIn, content;

    currentShows = Clickster.tvShows.current();
    signedIn = Clickster.currentUser.signedIn();
    content = this.template({
      signedIn: signedIn,
      shows: currentShows
    });

    this.$el.html(content);
    this.renderCards(currentShows);

    if (signedIn) {
      this.feed.isEmpty() ?
        this.feed.fetchNew() : this.renderFeed(this.feed.models);
    }

    return this;
  },

  onRender: function () {
    this.$(".timeago").timeago();
  },

  renderFeed: function (items) {
    var itemTemplate = JST["feedItem"],
        $feed = this.$(".feed");

    _(items).each(function (feedItem) {
      var $item = itemTemplate({ item: feedItem });
      $feed.prepend($item);
    });

    this.$(".timeago").timeago();
    this.setFeedUpdateInterval();
  },

  setFeedUpdateInterval: function () {
    if (!this.interval) {
      this.interval = setInterval(function () {
        this.feed.fetchNew();
      }.bind(this), 50000);

      this.resizeFeedWrapper();
      $(window).on("resize", this.resizeFeedWrapper.bind(this));
    }
  },

  resizeFeedWrapper: function () {
    if ($(window).width() > 500) {
      this.$(".feed").css({ width: this.feed.length * 220 + "px" });
    } else {
      this.$(".feed").removeAttr("style");
    }
  },

  remove: function () {
    if (this.interval) {
      clearInterval(this.interval);
      $(window).off("resize");
    }
    Backbone.View.prototype.remove.call(this);
  }
});
