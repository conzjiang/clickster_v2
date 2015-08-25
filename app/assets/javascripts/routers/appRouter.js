Clickster.Routers.AppRouter = Backbone.Router.extend({
  initialize: function (options) {
    this.$rootEl = $(options.rootEl);
    this.currentViews = {};

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
    'users/:username': 'userShow',
    'genres/:genre': 'genreShow',
    '_=_': 'home',
    'facebook': 'facebookProfile'
  },

  home: function () {
    var homeView = new Clickster.Views.HomeView();
    this._swapView(homeView);
  },

  tvIndex: function () {
    var indexView = new Clickster.Views.TvIndexView();
    this._swapView(indexView);
  },

  newTv: function () {
    var newTvView = new Clickster.Views.NewTvView({ action: "new" });
    this._swapView(newTvView);
  },

  editTv: function (id) {
    var tv = Clickster.tvShows.getOrFetch(id);
    var editTvView = new Clickster.Views.NewTvView({ tv: tv, action: "edit" });
    this._swapView(editTvView);
  },

  tvShow: function (id) {
    var tv = Clickster.tvShows.getOrFetch(id);
    var tvShowView = new Clickster.Views.TvShowView({ tv: tv });
    this._swapView(tvShowView);
  },

  searchResults: function (data) {
    var searchView = new Clickster.Views.SearchResultsView({ params: data });
    this._swapView(searchView);
  },

  userShow: function (username) {
    var user;

    if (Clickster.currentUser.get("username") === username) {
      user = Clickster.currentUser;
    } else {
      user = Clickster.users.getOrFetch(username);
    }

    var userView = new Clickster.Views.UserShowView({ user: user });
    this._swapView(userView);
  },

  userEdit: function () {
    var userEditView = new Clickster.Views.UserEditView();
    this._swapView(userEditView);
  },

  genreShow: function (genre) {
    var genreShowView = new Clickster.Views.GenreShowView({ genre: genre });
    this._swapView(genreShowView);
  },

  facebookProfile: function () {
    var facebookProfView = new Clickster.Views.FacebookProfileView();
    this._swapView(facebookProfView);
  },

  _swapView: function (view) {
    this._currentView && this._currentView.remove();
    this._currentView = view;

    this.$rootEl.html(view.render().$el);
    view.onRender && view.onRender();

    Clickster.eventManager.trigger("offSearch");
    $("main").scrollTop(0);
  }
});
