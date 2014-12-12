window.Clickster = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function(options) {
    Clickster.currentUser = new Clickster.Models.CurrentUser();
    Clickster.tvShows = new Clickster.Collections.TvShows();
    Clickster.users = new Clickster.Collections.Users();

    Clickster.formAuth = $('meta[name=csrf-token]').attr("content");
    Clickster.DECADES = JSON.parse($('#decades').html());
    Clickster.GENRES = JSON.parse($('#genres').html());
    Clickster.STATUSES = JSON.parse($('#statuses').html());

    new Clickster.Routers.AppRouter(options);
    Backbone.history.start();
  }
};
