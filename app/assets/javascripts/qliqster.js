window.Qliqster = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function(options) {
    this.currentUser = new Qliqster.Models.CurrentUser();
    this.eventManager = new Qliqster.EventManager({ $el: $(options.banner) });

    new Qliqster.Routers.AppRouter(options);
    Backbone.history.start();
  }
};
