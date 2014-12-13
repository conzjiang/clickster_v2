Clickster.Views.TvShowView = Backbone.View.extend({
  initialize: function (options) {
    this.tv = options.tv;

    this.listenTo(this.tv, "sync", this.render);
    this.listenTo(Clickster.currentUser, "sync", this.render);
  },

  className: "tv-show",

  template: JST["tv_shows/show"],

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
  }
});
