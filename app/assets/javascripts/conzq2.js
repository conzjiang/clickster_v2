window.Clickster = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function(options) {
    this.currentUser = new Clickster.Models.CurrentUser();

    this.filepickerOptions = {
      mimetype: "image/*",
      services: ["COMPUTER", "URL"]
    };

    this.eventManager = new Clickster.EventManager({ $el: $(options.banner) });

    new Clickster.Routers.AppRouter(options);
    Backbone.history.start();
  }
};