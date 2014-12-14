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
    "click li.list": "addToWatchlist"
  },

  toggleOptions: function () {
    this.$(".options > ul").toggleClass("show");
  },

  addToWatchlist: function () {
    var status = $(event.target).data("option");
    var $button = $(event.target);
    var that = this;

    $button.siblings().removeClass("selected");

    Clickster.currentUser.watchlists().create({
      tv_show_id: this.tv.id,
      status: status
    }, {
      success: function () {
        var $watchlistButton = that.$(".watchlist");
        that._scaleAndFadeButton($button.addClass("selected"));
        $watchlistButton.addClass("selected").attr("data-option", status);
        $watchlistButton.html(status);
      }
    });
  },

  render: function () {
    var isAdmin = Clickster.currentUser.get("is_admin");
    var content = this.template({ tv: this.tv, isAdmin: isAdmin });
    this.$el.html(content);

    if (this.tv.get("image_url")) {
      this.$(".image-block").css({
        "background-image": "url('" + this.tv.get("image_url") + "')"
      });
    }

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
  }
});
