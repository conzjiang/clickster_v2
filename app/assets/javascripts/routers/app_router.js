Clickster.Routers.AppRouter = Backbone.Router.extend({
  initialize: function (options) {
    this.$sidebar = options.$sidebar;
    this.$rootEl = options.$rootEl;

    var sidebarView = new Clickster.Views.Sidebar({ el: this.$sidebar });
    sidebarView.render();
  }
});
