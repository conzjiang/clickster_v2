Clickster.Views.UserShowView = Backbone.View.extend({
  initialize: function (options) {
    this.user = options.user;
    this.listenTo(this.user, "sync", this.render);
    this.listenTo(this.user, "error", this.error);
  },

  className: "user-show max",

  template: JST["users/show"],

  events: {
    "click .follow": "toggleFollow"
  },

  toggleFollow: function () {
    var message;

    if (this.user.get("is_following")) {
      message = "Unfollowing...";
    } else {
      message = "Following...";
    }

    this.$(".follow").html(message).prop("disabled", true);

    this.user.follow({
      success: function () {
        setTimeout(function () {
          this.$(".follow").prop("disabled", false);
          this.setFollowStatus();
        }.bind(this), 1000);
      }.bind(this)
    });
  },

  render: function () {
    var content = this.template({
      user: this.user,
      allStatuses: Clickster.LIST_STATUSES.concat(["Favorites"]),
      tvCard: JST["tv_shows/miniCard"]
    });

    this.$el.html(content);
    this.renderImageTiles();
    this.setFollowStatus();
    this.ellipsis();

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
      this.$(".follow").addClass("me");
    } else {
      this.$(".follow").removeClass("is-following").html("Follow");
    }
  }
});
