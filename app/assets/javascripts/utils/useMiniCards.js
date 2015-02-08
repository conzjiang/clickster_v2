Backbone.View.prototype.useMiniCards = function (tvs) {
  var $cards = this.$(".tv-cards"),
      template = JST["tv_shows/miniCard"];

  tvs.forEach(function (tv) {
    $cards.append(template({ tv: tv }));

    this._setStatuses({
      $watchlist: this.$("ul[data-id=" + tv.id + "] .watchlist"),
      $favorite: this.$("ul[data-id=" + tv.id + "] .favorite"),
      tv: tv
    });
  }.bind(this));
};

Backbone.View.prototype._setStatuses = function (options) {
  var $watchlist = options.$watchlist,
      $favorite = options.$favorite,
      tv = options.tv;

  if (tv.get("on_watchlist")) {
    $watchlist.addClass("on-watchlist");
    $watchlist.attr("status", tv.escape("watch_status"));
  }

  if (tv.get("is_favorite")) {
    $favorite.addClass("is-favorite");
  }
};