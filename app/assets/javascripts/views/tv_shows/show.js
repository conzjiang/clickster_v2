Clickster.Views.TvShowView = Backbone.View.extend({
  initialize: function (options) {
    this.tv = options.tv;

    this.listenTo(this.tv, "sync", this.render);
    this.listenTo(Clickster.currentUser, "sync", this.render);
  },

  className: "tv-show",

  template: JST["tv_shows/show"],

  events: {
    "click li.watchlist": "toggleOptions",
    "click li.favorite": "toggleFavorite",
    "click li.list": "addToWatchlist"
  },

  toggleOptions: function () {
    var signedIn = !!Clickster.currentUser.id;

    if (!signedIn) {
      this._warning();
      return;
    }

    this.$(".options > ul").toggleClass("show");
  },

  toggleFavorite: function (e) {
    var signedIn = !!Clickster.currentUser.id;
    var $button = $(e.target);
    var favorites = Clickster.currentUser.favorites();

    if (!signedIn) {
      this._warning();
      return;
    }

    favorites.create({ tv_show_id: this.tv.id }, {
      success: function (data) {
        if (data.get("destroyed")) {
          favorites.remove(data);
        }

        $button.toggleClass("selected");
      }
    });
  },

  addToWatchlist: function () {
    var status = $(event.target).data("option");
    var $button = $(event.target);
    var watchlists = Clickster.currentUser.watchlists();
    var that = this;

    var onSuccess = {
      success: function (data) {
        var $watchlistButton = that.$(".watchlist");
        that._scaleAndFadeButton($button.addClass("selected"));
        $watchlistButton.addClass("selected").attr("data-option", status);
        $watchlistButton.html(status);
      }
    };

    if ($button.hasClass("selected")) {
      this.deleteFromWatchlist(function () {
        $button.removeClass("selected");
      });

      return;
    }

    $button.siblings().removeClass("selected");

    if (watchlists.get(this.tv.id)) {
      watchlists.get(this.tv.id).save({ status: status }, onSuccess);
    } else {
      watchlists.create({ tv_show_id: this.tv.id, status: status }, onSuccess);
    }
  },

  deleteFromWatchlist: function (callback) {
    var watchlist = Clickster.currentUser.watchlists().get(this.tv.id);
    watchlist.set('id', this.tv.id);
    watchlist.destroy({ success: callback });
  },

  render: function () {
    var isAdmin = Clickster.currentUser.get("is_admin");
    var content = this.template({ tv: this.tv, isAdmin: isAdmin });
    this.$el.html(content);
    this._setImage();
    this._setWatchlistStatus();
    this._setFavorite();

    return this;
  },

  _scaleAndFadeButton: function ($button) {
    var $newButton = $button.clone();
    var transitioning = false;
    var that = this;

    $button.addClass("select");

    $button.children("strong").on("transitionend", function () {
      if (transitioning) {
        $button.replaceWith($newButton);
        $button.children("strong").off();
        that.toggleOptions();
      }

      if (!transitioning) {
        transitioning = true;
      }
    });
  },

  _setFavorite: function () {
    if (this.tv.isFavorite()) {
      this.$(".favorite").addClass("selected");
    }
  },

  _setImage: function () {
    if (this.tv.get("image_url")) {
      this.$(".image-block").css({
        "background-image": "url('" + this.tv.get("image_url") + "')"
      });
    }
  },

  _setWatchlistStatus: function () {
    if (this.tv.onWatchlist()) {
      var status = this.tv.watchStatus;
      this.$(".watchlist").attr("data-option", status);
      this.$(".watchlist").html(status);
      this.$("li[data-option='" + status + "']").addClass("selected");
    }
  },

  _warning: function () {
    var $warning = this.$(".warning");
    $warning.addClass("show");

    setTimeout(function () {
      $warning.removeClass("show");
    }, 2000);
  }
});
