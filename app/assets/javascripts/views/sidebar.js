Clickster.Views.Sidebar = Backbone.View.extend({
  template: JST['sidebar'],

  render: function () {
    var content = this.template({ user: Clickster.currentUser });
    this.$el.html(content);
    return this;
  }
});
