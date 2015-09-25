Clickster.Models.User = Backbone.Model.extend({
  urlRoot: "api/users",

  favorites: function () {
    if (!this._favorites) {
      this._favorites = new Clickster.Collections.TvShows();
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

  followers: function () {
    if (!this._followers) {
      this._followers = new Clickster.Collections.Users();
    }

    return this._followers;
  },

  idols: function () {
    if (!this._idols) {
      this._idols = new Clickster.Collections.Users();
    }

    return this._idols;
  },

  isCurrentUser: function () {
    return this.get("username") === Clickster.currentUser.get("username");
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

    if (response.followers) {
      this.followers().set(response.followers);
      delete response.followers;
    }

    if (response.idols) {
      this.idols().set(response.idols);
      delete response.idols;
    }

    return response;
  },

  publicUrl: function () {
    return "#/users/" + this.get("slug");
  },

  showImages: function () {
    var watchlists = this.watchlists().pluck("image_url");
    var favorites = this.favorites().pluck("image_url");

    return _.uniq(watchlists.concat(favorites));
  },

  watchlists: function (status) {
    if (!this._watchlists) {
      this._watchlists = new Clickster.Collections.TvShows();
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
