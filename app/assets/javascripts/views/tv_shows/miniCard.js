Clickster.Views.MiniCardView = Backbone.View.extend({
  initialize: function (options) {
    this.tv = options.tv;
    this.$el.data("id", this.tvId());
  },

  template: JST["tv_shows/miniCard"],

  tagName: "li",

  tvId: function () {
    return this.tv.id || this.tv.get("tv_show_id");
  },

  render: function () {
    var content = this.template({
      tv: this.tv,
      tvId: this.tvId()
    });

    this.$el.html(content);
    this.setWatchlistStatus();
    this.setFavorite();
    return this;
  },

  setWatchlistStatus: function () {
    if (!this.tv.get("on_watchlist")) return;

    this.$(".watchlist").
      addClass("on-watchlist").
      html(this.tv.escape("watch_status"));
  },

  setFavorite: function () {
    if (this.tv.get("is_favorite")) {
      this.$(".favorite").addClass("is-favorite");
    }
  }
});
