Clickster.Views.HomeView = Backbone.View.extend({
  initialize: function () {
    this.useTvCards();

    this.listenTo(Clickster.currentUser, "sync", this.render);
    this.listenTo(Clickster.tvShows, "sync", this.render);
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
    if (signedIn) this.renderFeed(Clickster.currentUser.feed.models);
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
  }
});
