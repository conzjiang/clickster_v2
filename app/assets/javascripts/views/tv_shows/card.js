Clickster.Views.TvCardView = Backbone.View.extend({
  initialize: function (options) {
    this.tv = options.tv;

    this.listenTo(this.tv, "change:is_favorite", this.setFavorite);
    this.listenTo(this.tv, "change:watch_status", this.setWatchlistStatus);
  },

  tagName: "li",

  className: "group",

  template: JST["tv_shows/card"],

  events: {
    "touchmove .title": "toggleBlurb",
    "click .title": "toggleBlurb",
    "click .watchlist": "toggleWatchlist",
    "click .status": "setStatus",
    "click .favorite": "toggleFavorite"
  },

  toggleBlurb: function (e) {
    var $content, isClosed;

    e.preventDefault();
    $content = this.$(".content");
    isClosed = parseInt($content.css("top"));

    if (isClosed && !this.closing) {
      $content.addClass("open");
    } else {
      $content.removeClass("open");
      this.closing = true;

      $content.one("transitionend", function () {
        this.closing = false;
      }.bind(this));
    }
  },

  toggleWatchlist: function () {
    if (!this.authenticate()) return;

    if (!this.settingStatus) {
      this.$(".statuses").toggleClass("show");
      this.setClickHandler();
    }
  },

  authenticate: function () {
    if (Clickster.currentUser.signedIn()) {
      return true;
    }

    Clickster.eventManager.trigger("signIn");
    return false;
  },

  setClickHandler: function () {
    if (!this.$(".statuses").hasClass("show")) return;

    Clickster.eventManager.clickOut({
      isOutside: function ($target) {
        var outside = !$target.closest(".statuses").length,
            otherPopout = $target.is(".watchlist") &&
              ($target.data("id") !== this.tv.id);

        return outside || otherPopout;
      }.bind(this),

      callback: function () {
        this.$(".statuses").removeClass("show");
      }.bind(this)
    });
  },

  setStatus: function (e) {
    var $status = $(e.currentTarget), that = this;

    this.settingStatus = true;

    this.$(".status").removeClass("choose");
    $status.addClass("choose");

    this.tv.addToWatchlist({
      data: { status: $status.data("option") },
      success: function () {
        that.settingStatus = false;
        setTimeout(that.toggleWatchlist.bind(that), 700);
      }
    });
  },

  toggleFavorite: function () {
    if (!this.authenticate()) return;

    this.tv.favorite({
      success: function () {
        this.$(".favorite").scaleAndFade();
      }.bind(this)
    });
  },

  render: function () {
    var content = this.template({ tv: this.tv });
    this.$el.html(content);
    this.setImage();
    this.setWatchlistStatus();
    this.setFavorite();

    return this;
  },

  setImage: function () {
    if (this.tv.get("image_url")) {
      this.$(".image-block").css({
        "background-image": "url(" + this.tv.escape("image_url") + ")"
      });
    }
  },

  setWatchlistStatus: function () {
    if (this.tv.get("on_watchlist")) {
      this.$(".watchlist").addClass("on-watchlist");

      var status = this.tv.get("watch_status");
      this.$(".status[data-option='" + status + "']").addClass("choose");
    } else {
      this.$(".watchlist").removeClass("on-watchlist");
      this.$(".choose").removeClass("choose");
    }
  },

  setFavorite: function () {
    if (this.tv.get("is_favorite")) {
      this.$(".favorite").addClass("is-favorite");
    } else {
      this.$(".favorite").removeClass("is-favorite");
    }
  }
});
