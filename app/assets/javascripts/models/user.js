Clickster.Models.User = Backbone.Model.extend({
  initialize: function (options) {
    if (options) this.set("username", options.username);
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
      this._favorites = new Clickster.Collections.Lists([], { user: this });
    }

    return this._favorites;
  },

  parse: function (response) {
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

  showImages: function () {
    var watchlists = this.watchlists().pluck("image_url");
    var favorites = this.favorites().pluck("image_url");

    return _.uniq(watchlists.concat(favorites));
  },

  watchlists: function (status) {
    if (!this._watchlists) {
      this._watchlists = new Clickster.Collections.Lists([], { user: this });
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