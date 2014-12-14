Clickster.Models.CurrentUser = Backbone.Model.extend({
  url: 'api/current_user',

  parse: function (response) {
    if (response.tv_shows) {
      this.tvShows().set(response.tv_shows);
      delete response.tv_shows;
    }

    if (response.watchlists) {
      this.watchlists().set(response.watchlists);
      delete response.watchlists;
    }

    return response;
  },

  tvShows: function () {
    if (!this._tvShows) {
      this._tvShows = new Clickster.Collections.TvShows({
        user: this
      });
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
