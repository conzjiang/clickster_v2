Clickster.Models.CurrentUser = Clickster.Models.User.extend({
  initialize: function () {
    this.feed = new Clickster.Collections.Feed();
  },

  url: 'api/current_user',

  tvShows: function () {
    if (!this.get("is_admin")) return;
    return Clickster.tvShows.admin();
  }
});
