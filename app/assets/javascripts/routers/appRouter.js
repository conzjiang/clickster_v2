Clickster.Routers.AppRouter = Backbone.Router.extend({
  initialize: function (options) {
    this.$rootEl = $(options.rootEl);

    new Clickster.Views.Nav({ el: options.navbar }).render();
  },

  routes: {
    '': 'home',
    'tv': 'tvIndex',
    'tv/new': 'newTv',
    'tv/:id/edit': 'editTv',
    'tv/:id': 'tvShow',
    'search': 'searchResults',
    'user/edit': 'userEdit',
    'users/:username/followers': 'userFollowers',
    'users/:username': 'userShow',
    'genres/:genre': 'genreShow',
    '_=_': 'home',
    'facebook': 'facebookProfile'
  },

  home: function () {
    var currentShows = new Clickster.Collections.TvShows([], {
      url: 'api/tv_shows'
    });

    currentShows.fetch();

    var homeView = new Clickster.Views.HomeView({
      collection: currentShows
    });

    this._swapView(homeView);
  },

  tvIndex: function () {
    var adminShows = new Clickster.Collections.TvShows([], {
      url: 'api/tv_shows/admin'
    });

    adminShows.fetch();

    var indexView = new Clickster.Views.TvIndexView({
      collection: adminShows
    });

    this._swapView(indexView);
  },

  newTv: function () {
    var newTvView = new Clickster.Views.NewTvView({ action: "new" });
    this._swapView(newTvView);
  },

  editTv: function (id) {
    var tv = new Clickster.Models.TvShow({ id: id });
    tv.fetch();

    var editTvView = new Clickster.Views.NewTvView({ tv: tv, action: "edit" });
    this._swapView(editTvView);
  },

  tvShow: function (id) {
    var tv = new Clickster.Models.TvShow({ id: id });
    tv.fetch();

    var tvShowView = new Clickster.Views.TvShowView({ tv: tv });
    this._swapView(tvShowView);
  },

  searchResults: function (data) {
    var searchView = new Clickster.Views.SearchResultsView({
      model: Clickster.searchResults.getOrFetch(data)
    });

    this._swapView(searchView);
  },

  userFollowers: function (username) {
    var user = new Clickster.Models.User({ username: username });
    user.fetch();

    var userView = new Clickster.Views.UserShowView({
      user: user,
      selected: "Followers"
    });

    this._swapView(userView);
  },

  userShow: function (username) {
    var user = new Clickster.Models.User({ username: username });
    user.fetch();

    var userView = new Clickster.Views.UserShowView({ user: user });
    this._swapView(userView);
  },

  userEdit: function () {
    var userEditView = new Clickster.Views.UserEditView();
    this._swapView(userEditView);
  },

  genreShow: function (genre) {
    var genreShows = new Clickster.Collections.TvShows([], {
      url: 'api/genres/' + genre
    });

    genreShows.fetch();

    var genreShowView = new Clickster.Views.GenreShowView({
      collection: genreShows,
      genre: Utils.dehyphenate(genre)
    });

    this._swapView(genreShowView);
  },

  facebookProfile: function () {
    var facebookProfView = new Clickster.Views.FacebookProfileView();
    this._swapView(facebookProfView);
  },

  _swapView: function (view) {
    this._currentView && this._currentView.remove();
    this._currentView = view;

    this.$rootEl.html(view.$el);
    view.render();

    Clickster.eventManager.trigger("offSearch");
    $("main").scrollTop(0);
  }
});
