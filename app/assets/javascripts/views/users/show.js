Clickster.Views.UserShowView = Backbone.View.extend({
  initialize: function (options) {
    this.user = options.user;
    this.listenTo(this.user, "sync", this.render);
    this.listenTo(this.user, "notFound", this.error);
  },

  className: "user-show max",

  template: JST["users/show"],

  events: {
    "click .follow": "toggleFollow"
  },

  toggleFollow: function () {
    var message, followCallback;

    message = this.user.get("is_following") ? "Unfollowing..." : "Following...";

    this.$(".follow").html(message).prop("disabled", true);

    followCallback = function () {
      this.$(".follow").prop("disabled", false);
      this.setFollowStatus();
    }.bind(this);

    this.user.follow({
      success: function () {
        setTimeout(followCallback, 1000);
      }
    });
  },

  render: function () {
    var allStatuses = Clickster.LIST_STATUSES.concat(["Favorites"]);
    var content = this.template({
      user: this.user,
      allStatuses: allStatuses,
      tvCard: JST["tv_shows/miniCard"]
    });

    if (this.user.notFound) {
      this.error();
    } else {
      this.$el.html(content);
      this.renderImageTiles();
      this.setFollowStatus();
      this.ellipsis();
    }

    return this;
  },

  error: function () {
    this.$el.html("User not found");
  },

  renderImageTiles: function () {
    var images = _.shuffle(this.user.showImages());
    var imageTileColors = Utils.imageTileColors;
    var rand = Utils.random;

    this.$(".image-tiles > li").each(function () {
      var imageIndex = rand(images.length);
      var colorIndex = rand(imageTileColors.length);

      $(this).find(".cover").css({ background: imageTileColors[colorIndex] });

      if (images.length && images[imageIndex]) {
        $(this).css({ "background-image": "url(" + images[imageIndex] + ")" });
      }
    });
  },

  setFollowStatus: function () {
    if (this.user.get("is_following")) {
      this.$(".follow").addClass("is-following").html("Following");
    } else if (this.user.get("is_current_user")) {
      this.$(".follow").addClass("me").prop("disabled", true).html("Me");
    } else {
      this.$(".follow").removeClass("is-following").html("Follow");
    }
  }
});