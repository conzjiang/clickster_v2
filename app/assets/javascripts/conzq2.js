window.Clickster = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function(options) {
    Clickster.currentUser = new Clickster.Models.CurrentUser();
    Clickster.formAuth = $('meta[name=csrf-token]').attr("content");
    Clickster.DECADES = JSON.parse($('#decades').html());

    new Clickster.Routers.AppRouter(options);
    Backbone.history.start();
  }
};
