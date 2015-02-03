Clickster.Models.CurrentUser = Clickster.Models.User.extend({
  url: 'api/current_user',

  isAdmin: function (tv) {
    if (!this.get("is_admin")) return false;
    return !!this.tvShows.get(tv.id);
  },

  parse: function (response) {
    if (response.tv_shows) {
      this.tvShows = new Clickster.Collections.TvShows({
        user: this
      });

      this.tvShows.set(response.tv_shows);
      delete response.tv_shows;
    }

    if (response.feed) {
      this.feed = new Clickster.Collections.Feed();
      this.feed.set(response.feed);
      delete response.feed;
    }

    return Clickster.Models.User.prototype.parse.call(this, response);
  }
});
