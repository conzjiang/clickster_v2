Clickster.Views.NewTv = Backbone.View.extend({
  initialize: function () {
    this.tv = new Clickster.Models.TvShow();
  },

  className: 'tv-forms',

  template: JST['tv_shows/new'],

  render: function () {
    this.$el.html(this.template({ tv: this.tv }));
    return this;
  }
});
