Clickster.Views.Home = Backbone.View.extend({
  template: JST['home'],

  render: function () {
    var content = this.template({ shows: Clickster.tvShows });
    this.$el.html(content);
    return this;
  }
});
