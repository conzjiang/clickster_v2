Clickster.Models.User = Backbone.Model.extend({
  initialize: function (options) {
    this.set("username", options.username);
    this.isCurrentUser = Clickster.currentUser.id === this.id;
  },

  url: function () {
    return '/api/users/' + this.get("username");
  },

  favoriteCount: function () {
    return this.favorites().length;
  },

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

  watchlists: function (status) {
    if (!this._watchlists) {
      this._watchlists = new Clickster.Collections.Lists({
        user: this,
        url: 'api/current_user/watchlists'
      });
    }

    if (status) {
      return this._watchlists.filter(function (watchlist) {
        return watchlist.get("status") === status;
      });
    }

    return this._watchlists;
  },

  watchNum: function () {
    return this.watchlists("Watching").length;
  }
});