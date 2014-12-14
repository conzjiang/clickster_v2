Clickster.Models.CurrentUser = Backbone.Model.extend({
  url: 'api/current_user',

  favorites: function () {
    if (!this._favorites) {
      this._favorites = new Clickster.Collections.Lists({
        user: this,
        url: 'api/current_user/favorites'
      });
    }

    return this._favorites;
  },

  parse: function (response) {
    if (response.tv_shows) {
      this.tvShows().set(response.tv_shows);
      delete response.tv_shows;
    }

    if (response.watchlists) {
      this.watchlists().set(response.watchlists);
      delete response.watchlists;
    }

    if (response.favorites) {
      this.favorites().set(response.favorites);
      delete response.favorites;
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
      this._watchlists = new Clickster.Collections.Lists({
        user: this,
        url: 'api/current_user/watchlists'
      });
    }

    return this._watchlists;
  }
});
