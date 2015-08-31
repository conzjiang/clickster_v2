Clickster.Models.User = Backbone.Model.extend({
  url: function () {
    return '/api/users/' + this.get("username");
  },

  favorites: function () {
    if (!this._favorites) {
      this._favorites = new Clickster.Collections.TvShows([], { user: this });
    }

    return this._favorites;
  },

  follow: function (options) {
    var that = this;

    $.ajax({
      type: "post",
      url: this.url() + "/follow",
      dataType: "json",
      success: function (data) {
        that.set(data);
        if (options && options.success) options.success(data);
      }
    });
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
      this._watchlists = new Clickster.Collections.TvShows([], { user: this });
    }

    if (status) {
      return this._watchlists.filter(function (tv) {
        return tv.get("watch_status") === status;
      });
    }

    return this._watchlists;
  },

  toJSON: function () {
    return { user: _.clone(this.attributes) };
  }
});
