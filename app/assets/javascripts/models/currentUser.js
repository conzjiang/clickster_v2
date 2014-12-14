Clickster.Models.CurrentUser = Backbone.Model.extend({
  url: 'api/current_user',

  tvShows: function () {
    if (!this._tvShows) {
      this._tvShows = new Clickster.Collections.TvShows({
        user: this
      });
      this._tvShows.url = 'api/current_user/tv_shows';
      this._tvShows.fetch();
    }

    return this._tvShows;
  },

  watchlists: function () {
    if (!this._watchlists) {
      this._watchlists = new Clickster.Collections.Watchlists({
        user: this
      });
    }

    return this._watchlists;
  }
});
