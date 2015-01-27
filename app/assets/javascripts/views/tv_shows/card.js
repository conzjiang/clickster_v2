Clickster.Views.TvCardView = Backbone.View.extend({
  initialize: function (options) {
    this.tv = options.tv;
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
    this.$(".statuses").toggleClass("show");
    this.setClickHandler();
  },

  setClickHandler: function () {
    if (this.$(".statuses").hasClass("show")) {
      Clickster.errorManager.clickOut({
        isOutside: function ($target) {
          var otherPopout = $target.data("id") !== this.tv.id,
              outside = !$target.closest(".statuses").length;

          return otherPopout && outside;
        }.bind(this),

        callback: this.toggleWatchlist.bind(this)
      });
    }
  },

  setStatus: function (e) {
    var $status;

    e.stopPropagation();
    $status = $(e.target);

    this.$(".status").removeClass("choose");
    $status.addClass("choose");

    this.tv.addToWatchlist({
      data: { status: $status.data("option") },
      success: this.toggleWatchlist.bind(this)
    });
  },

  toggleFavorite: function () {
    var options = {
      success: function () {
        this.$(".favorite").toggleClass("is-favorite");
        this.$(".favorite").scaleAndFade();
      }.bind(this)
    };

    this.authenticate(function () {
      this.tv.favorite(options);
    });
  },

  authenticate: function (callback) {
    var signedIn = !!Clickster.currentUser.id;

    if (signedIn) {
      callback.call(this);
    } else {
      Clickster.errorManager.trigger("signIn");
    }
  },

  feedback: function (message, options) {
    var $feedback;

    this.$(".feedback").addClass("show").html(message);
    if (options) this.$(".feedback").addClass(options.class);

    $feedback = this.$(".feedback");

    setTimeout(function () {
      $feedback.removeClass("show");
    }, 1000);
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
    var status, $option;

    if (this.tv.get("on_watchlist")) {
      this.$(".watchlist").addClass("on-watchlist");

      status = this.tv.get("watch_status");
      $option = this.$(".status[data-option='" + status + "']");
      $option.addClass("choose");
    }
  },

  setFavorite: function () {
    if (this.tv.get("is_favorite")) {
      this.$(".favorite").addClass("is-favorite");
    }
  }
});