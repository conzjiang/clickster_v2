window.Clickster = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function(options) {
    Clickster.DECADES = JSON.parse($('#decades').html());
    new Clickster.Routers.AppRouter(options);
    Backbone.history.start();
  }
};
