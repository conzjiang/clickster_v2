Qliqster.Routers.AppRouter = Backbone.Router.extend({
  initialize: function (options) {
    this.$rootEl = $(options.rootEl);

    new Qliqster.Views.Nav({ el: options.navbar }).render();
  },

  routes: {
    '': 'home',
    'tv': 'tvIndex',
    'tv/new': 'newTv',
    'tv/:id/edit': 'editTv',
    'tv/:id': 'tvShow',
    'search': 'searchResults',
    'user/edit': 'userEdit',
    'users/id/:id': 'userIdShow',
    'users/:slug/followers': 'userFollowers',
    'users/:slug': 'userShow',
    'genres/:genre': 'genreShow',
    '_=_': 'home',
    'facebook': 'facebookProfile',
    'feed': 'feed'
  },

  home: function () {
    var currentShows = new Qliqster.Collections.TvShows([], {
      url: 'api/tv_shows'
    });

    currentShows.fetch();

    var homeView = new Qliqster.Views.HomeView({
      collection: currentShows
    });

    this._swapView(homeView);
  },

  tvIndex: function () {
    var adminShows = new Qliqster.Collections.TvShows([], {
      url: 'api/tv_shows/admin'
    });

    adminShows.fetch();

    var indexView = new Qliqster.Views.TvIndexView({
      collection: adminShows
    });

    this._swapView(indexView);
  },

  newTv: function () {
    var newTvView = new Qliqster.Views.NewTvView({ action: "new" });
    this._swapView(newTvView);
  },

  editTv: function (id) {
    var tv = new Qliqster.Models.TvShow({ id: id });
    tv.fetch();

    var editTvView = new Qliqster.Views.NewTvView({ tv: tv, action: "edit" });
    this._swapView(editTvView);
  },

  tvShow: function (id) {
    var tv = new Qliqster.Models.TvShow({ id: id });
    tv.fetch();

    var tvShowView = new Qliqster.Views.TvShowView({ tv: tv });
    this._swapView(tvShowView);
  },

  searchResults: function (data) {
    var searchView = new Qliqster.Views.SearchResultsView({
      model: Qliqster.searchResults.getOrFetch(data)
    });

    this._swapView(searchView);
  },

  userFollowers: function (slug) {
    var user = new Qliqster.Models.User({ slug: slug });
    user.fetch();

    var userView = new Qliqster.Views.UserShowView({
      user: user,
      selected: "Followers"
    });

    this._swapView(userView);
  },

  userShow: function (slug) {
    var user = new Qliqster.Models.User({ slug: slug });
    user.fetch();

    var userView = new Qliqster.Views.UserShowView({ user: user });
    this._swapView(userView);
  },

  userEdit: function () {
    var userEditView = new Qliqster.Views.UserEditView();
    this._swapView(userEditView);
  },

  userIdShow: function (id) {
    var user = new Qliqster.Models.User({ id: id });
    user.fetch();

    var userView = new Qliqster.Views.UserShowView({ user: user });
    this._swapView(userView);
  },

  genreShow: function (genre) {
    var genreShows = new Qliqster.Collections.TvShows([], {
      url: 'api/genres/' + genre
    });

    genreShows.fetch();

    var genreShowView = new Qliqster.Views.GenreShowView({
      collection: genreShows,
      genre: Utils.dehyphenate(genre)
    });

    this._swapView(genreShowView);
  },

  facebookProfile: function () {
    var facebookProfView = new Qliqster.Views.FacebookProfileView();
    this._swapView(facebookProfView);
  },

  feed: function () {
    var feedView = new Qliqster.Views.FeedIndexView();
    this._swapView(feedView);
  },

  _swapView: function (view) {
    this._currentView && this._currentView.remove();
    this._currentView = view;

    this.$rootEl.html(view.$el);
    view.render();

    Qliqster.eventManager.trigger("offSearch");
    $("main").scrollTop(0);
  }
});
