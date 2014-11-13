Clickster.Views.NewTv = Backbone.View.extend({
  initialize: function () {
    this.tv = new Clickster.Models.TvShow();
  },

  template: JST['tv_shows/new'],

  render: function () {
    this.$el.html(this.template({ tv: this.tv }));
    return this;
  }
});
