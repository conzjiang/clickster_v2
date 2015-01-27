window.Clickster = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function(options) {
    this.currentUser = new Clickster.Models.CurrentUser();
    this.tvShows = new Clickster.Collections.TvShows();
    this.users = new Clickster.Collections.Users();

    this.filepickerOptions = {
      mimetype: "image/*",
      services: ["COMPUTER", "URL"]
    };

    this.eventManager = new Clickster.EventManager({ $el: options.$banner });
    delete options.$banner;

    new Clickster.Routers.AppRouter(options);
    Backbone.history.start();
  }
};