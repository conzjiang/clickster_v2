Clickster.Views.TvShow = Backbone.View.extend({
  initialize: function (options) {
    this.tv = options.tv;

    this.listenTo(this.tv, 'sync', this.render);
  },

  template: JST['tv_shows/show'],

  render: function () {
    var isAdmin = Clickster.currentUser.get('is_admin');
    var content = this.template({ tv: this.tv, isAdmin: isAdmin });
    this.$el.html(content);
    return this;
  }
});
