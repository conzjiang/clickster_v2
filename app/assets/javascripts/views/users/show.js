Clickster.Views.UserShowView = Backbone.View.extend({
  initialize: function (options) {
    this.user = options.user;
    this.listenTo(this.user, "sync", this.render);
    this.listenTo(this.user, "notFound", this.error);
  },

  className: "user-show",

  template: JST["users/show"],

  error: function () {
    this.$el.html("User not found");
  },

  render: function () {
    var allStatuses = Clickster.LIST_STATUSES.concat(["Favorites"]);
    var content = this.template({
      user: this.user,
      allStatuses: allStatuses,
      tvCard: JST["tv_shows/card"]
    });

    if (this.user.notFound) {
      this.error();
    } else {
      this.$el.html(content);
      this.renderImageTiles();
      this.dotdotdot();
    }

    return this;
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
  }
});