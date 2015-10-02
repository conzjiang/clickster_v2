Qliqster.Views.TvShowView = Backbone.View.extend({
  initialize: function (options) {
    this.tv = options.tv;
    this.listenTo(this.tv, "sync", this.render);
  },

  className: "tv-show max",

  template: JST["tv_shows/show"],

  events: {
    "click li.list": "toggleWatchlist",
    "click li.favorite": "toggleFavorite"
  },

  toggleWatchlist: function (event) {
    if (!this.authenticate()) return;

    var $button = $(event.currentTarget);

    this.tv.addToWatchlist({
      data: {
        status: $button.data("option")
      },
      success: function () {
        this.toggleButton($button, function () {
          this.setWatchlistStatus();
          this.tv.fetchWatchCounts();
        });
      }.bind(this)
    });
  },

  authenticate: function () {
    if (Qliqster.currentUser.signedIn()) {
      return true;
    }

    this.warning();
    return false;
  },

  warning: function () {
    var $warning = this.$(".warning");
    $warning.addClass("show");

    setTimeout(function () {
      $warning.removeClass("show");
    }, 2000);
  },

  toggleButton: function ($button, callback) {
    if ($(window).width() < 500) {
      callback.call(this);
    } else {
      $button.scaleAndFade(callback.bind(this));
    }
  },

  toggleFavorite: function (e) {
    if (!this.authenticate()) return;

    this.tv.favorite({
      success: function () {
        this.toggleButton(this.$(".favorite"), function () {
          this.setFavorite();
          this.tv.fetchWatchCounts();
        });
      }.bind(this)
    });
  },

  render: function () {
    var content = this.template({
      tv: this.tv,
      isAdmin: this.tv.get("belongs_to_admin")
    });

    this.$el.html(content);
    this.setImage();
    this.setFavorite();
    this.setWatchlistStatus();
    this.renderWatchCounts();

    return this;
  },

  setImage: function () {
    var imageUrl = this.tv.get("image_url");

    if (imageUrl) {
      var shuffledColors = _.shuffle(Utils.imageTileColors);

      this.$(".image-tiles > li").css({
        "background-image": "url('" + imageUrl + "')"
      });

      this.$("div.cover").each(function () {
        $(this).css({ "background-color": shuffledColors.pop() });
      });
    }
  },

  setFavorite: function () {
    if (this.tv.get("is_favorite")) {
      this.$(".favorite").addClass("icon-full-heart is-favorite");
    } else {
      this.$(".favorite").removeClass("icon-full-heart is-favorite");
    }
  },

  setWatchlistStatus: function () {
    if (this.tv.get("on_watchlist")) {
      var status = this.tv.escape("watch_status");
      var $button = this.$("li[data-option='" + status + "']");

      $button.addClass("on-watchlist");
      $button.siblings(".on-watchlist").removeClass("on-watchlist");
    } else {
      this.$("li.list").removeClass("on-watchlist");
    }
  },

  renderWatchCounts: function (watchStatus) {
    this.watchCountsView && this.watchCountsView.remove();

    this.watchCountsView = new Qliqster.Views.WatchCountsView({
      tv: this.tv,
      watchStatus: this._getInitialWatchStatus()
    });

    this.$(".tv-show-left").append(this.watchCountsView.$el);
    this.watchCountsView.render();
  },

  _getInitialWatchStatus: function () {
    if (this.tv.get("is_favorite")) {
      return "Favorites";
    } else {
      return this.tv.escape("watch_status") || "Watching";
    }
  },

  remove: function () {
    this.watchCountsView && this.watchCountsView.remove();
    Backbone.View.prototype.remove.call(this);
  }
});
