window.Clickster = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function(options) {
    Clickster.currentUser = new Clickster.Models.CurrentUser();
    Clickster.tvShows = new Clickster.Collections.TvShows();
    Clickster.users = new Clickster.Collections.Users();

    Clickster.filepickerOptions = {
      mimetype: "image/*",
      services: ["COMPUTER", "URL"]
    };

    new Clickster.Routers.AppRouter(options);
    Backbone.history.start();
  }
};