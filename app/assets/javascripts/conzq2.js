window.Clickster = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function(options) {
    new Clickster.Routers.AppRouter(options);
    Backbone.history.start();
  }
};
