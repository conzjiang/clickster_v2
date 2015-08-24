Clickster.Views.TvShowView = Backbone.View.extend({
  initialize: function (options) {
    this.tv = options.tv;

    this.listenTo(this.tv, "sync", this.render);
    this.listenTo(Clickster.currentUser, "sync", this.render);
  },

  className: "tv-show max",

  template: JST["tv_shows/show"],

  events: {
    "click li.list": "toggleWatchlist",
    "click li.favorite": "toggleFavorite"
  },

  toggleWatchlist: function (event) {
    this.authenticate(function () {
      var $button = $(event.target),
          status = $button.data("option"),
          that = this;

      this.tv.addToWatchlist({
        data: { status: status },
        success: function () {
          $button.scaleAndFade(that.setWatchlistStatus.bind(that));
        }
      });
    });
  },

  authenticate: function (callback) {
    var signedIn = !!Clickster.currentUser.id;

    if (signedIn) {
      callback.call(this);
    } else {
      this.warning();
    }
  },

  warning: function () {
    var $warning = this.$(".warning");
    $warning.addClass("show");

    setTimeout(function () {
      $warning.removeClass("show");
    }, 2000);
  },

  toggleFavorite: function (e) {
    var that = this,
        toggleButton = function () {
          that.$(".favorite").scaleAndFade(that.setFavorite.bind(that));
        };

    this.authenticate(function () {
      this.tv.favorite({ success: toggleButton });
    });
  },

  render: function () {
    var isAdmin = this.tv.get("belongs_to_admin");
    var content = this.template({ tv: this.tv, isAdmin: isAdmin });
    this.$el.html(content);
    this.setImage();
    this.setFavorite();
    this.setWatchlistStatus();

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
    var status, $button;

    if (this.tv.get("on_watchlist")) {
      status = this.tv.escape("watch_status");
      $button = this.$("li[data-option='" + status + "']");

      $button.addClass("on-watchlist");
      $button.siblings(".on-watchlist").removeClass("on-watchlist");
    } else {
      this.$("li.list").removeClass("on-watchlist");
    }
  }
});
