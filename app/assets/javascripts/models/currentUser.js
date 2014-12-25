Clickster.Models.CurrentUser = Clickster.Models.User.extend({
  initialize: function () {
    this.isCurrentUser = true;
  },

  url: 'api/current_user',

  isAdmin: function (tv) {
    if (!this.get("is_admin")) return false;
    return !!Clickster.currentUser.tvShows().get(tv.id);
  },

  parse: function (response) {
    if (response.tv_shows) {
      this.tvShows().set(response.tv_shows);
      delete response.tv_shows;
    }

    return Clickster.Models.User.prototype.parse.call(this, response);
  },

  tvShows: function () {
    if (!this._tvShows) {
      this._tvShows = new Clickster.Collections.TvShows({
        user: this
      });
    }

    return this._tvShows;
  }
});
