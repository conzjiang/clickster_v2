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
    "click .tv-info": "hideOptions",
    "click li.list": "toggleWatchlist",
    "click li.favorite": "toggleFavorite"
  },

  toggleOptions: function () {
    this.authenticate(function () {
      this.$(".options > ul").toggleClass("show");
    });
  },

  authenticate: function (callback) {
    var signedIn = !!Clickster.currentUser.id;

    if (signedIn) {
      callback.call(this);
    }
  },

  warning: function () {
    var $warning = this.$(".warning");
    $warning.addClass("show");

    setTimeout(function () {
      $warning.removeClass("show");
    }, 2000);
  },

  hideOptions: function () {
    if (this.$(".options > ul").hasClass("show")) {
      this.toggleOptions();
    }
  },

  toggleWatchlist: function (event) {
    var $button = $(event.target);
    var status = $button.data("option");

    if ($button.hasClass("selected")) {
      this.deleteFromWatchlist();
    } else {
      this.addToWatchlist(status);
    }
  },

  deleteFromWatchlist: function () {
    var watchlist = Clickster.currentUser.watchlists().getList(this.tv.id);

    watchlist.set('id', this.tv.id);
    watchlist.destroy({
      success: this.removeWatchlistStatus.bind(this)
    });
  },

  removeWatchlistStatus: function () {
    var $buttons = this.$("li.list");
    var $watchlistButton = this.$(".watchlist");

    $buttons.removeClass("selected");
    $watchlistButton.removeClass("selected").removeAttr("data-option");
    $watchlistButton.html("Add to Watchlist");

    setTimeout(this.toggleOptions.bind(this), 500);
  },

  addToWatchlist: function (status) {
    var $button = this.$("li.list[data-option='" + status + "']");
    var watchlists = Clickster.currentUser.watchlists();
    var watchlist = watchlists.getList(this.tv.id);
    var onSuccess = {
      success: function (data) {
        this.scaleAndFadeButton($button.addClass("selected"));
        this.setWatchlistStatus(status);
      }.bind(this)
    };

    $button.siblings().removeClass("selected");

    if (watchlist) {
      watchlist.save({ status: status }, onSuccess);
    } else {
      watchlists.create({ tv_show_id: this.tv.id, status: status }, onSuccess);
    }
  },

  scaleAndFadeButton: function ($button) {
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

  setWatchlistStatus: function (status) {
    this.$(".watchlist").attr("data-option", status);
    this.$(".watchlist").html(status);
    this.$("li[data-option='" + status + "']").addClass("selected");
  },

  toggleFavorite: function (e) {
    this.authenticate(function () {
      var $button = $(e.target);
      var favorites = Clickster.currentUser.favorites();

      favorites.send({ tv_show_id: this.tv.id }, {
        success: this.setFavorite.bind(this)
      });
    });
  },

  render: function () {
    var isAdmin = Clickster.currentUser.isAdmin(this.tv);
    var content = this.template({ tv: this.tv, isAdmin: isAdmin });
    this.$el.html(content);
    this.setImage();
    this.setFavorite();

    if (this.tv.get("on_watchlist")) {
      this.setWatchlistStatus(this.tv.get("watch_status"));
    }

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
      this.$(".favorite").toggleClass("selected");
    }
  },

  remove: function () {
    $("main").off("touchmove");
    $("main").off("scroll");
    return Backbone.View.prototype.remove.apply(this);
  }
});
