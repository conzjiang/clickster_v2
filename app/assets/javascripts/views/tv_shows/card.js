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
    return this;
  }
});