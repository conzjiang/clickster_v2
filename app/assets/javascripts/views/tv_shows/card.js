Clickster.Views.TvCardView = Backbone.View.extend({
  initialize: function (options) {
    this.tv = options.tv;
  },

  tagName: "li",

  className: "group",

  template: JST["tv_shows/card"],

  render: function () {
    var content = this.template({ tv: this.tv });
    this.$el.html(content);

    if (this.tv.get("image_url")) {
      this.$(".image-block").css({
        "background-image": "url(" + this.tv.escape("image_url") + ")"
      });
    }

    return this;
  }
});