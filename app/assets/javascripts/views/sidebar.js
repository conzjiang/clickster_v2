Clickster.Views.Sidebar = Backbone.View.extend({
  initialize: function () {
    this.listenTo(Clickster.currentUser, 'sync', this.render);
  },

  template: JST['sidebar'],

  render: function () {
    var content = this.template({ signedIn: !!Clickster.currentUser.id });
    this.$el.html(content);
    return this;
  }
});
