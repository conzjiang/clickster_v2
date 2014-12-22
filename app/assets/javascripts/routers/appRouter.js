Clickster.Routers.AppRouter = Backbone.Router.extend({
  initialize: function (options) {
    this.$navbar = options.$navbar;
    this.$rootEl = options.$rootEl;

    var navbarView = new Clickster.Views.Nav({ el: this.$navbar });
    navbarView.render();
  },

  routes: {
    '': 'home',
    'tv': 'tvIndex',
    'tv/new': 'newTv',
    'tv/:id/edit': 'editTv',
    'tv/:id': 'tvShow',
    'search': 'searchResults',
    'users/edit': 'userEdit',
    'users/:username': 'userShow',
    'genres/:genre': 'genreShow'
  },

  home: function () {
    var homeView = new Clickster.Views.Home();
    this._swapRootEl(homeView);
  },

  tvIndex: function () {
    var indexView = new Clickster.Views.TvIndex();
    this._swapRootEl(indexView);
  },

  newTv: function () {
    var newTvView = new Clickster.Views.NewTvView({ action: "new" });
    this._swapRootEl(newTvView);
  },

  tvShow: function (id) {
    var tv = Clickster.tvShows.getOrFetch(id);
    var tvShowView = new Clickster.Views.TvShowView({ tv: tv });
    this._swapRootEl(tvShowView);
  },

  editTv: function (id) {
    var tv = Clickster.tvShows.getOrFetch(id);
    var editTvView = new Clickster.Views.NewTvView({ tv: tv, action: "edit" });
    this._swapRootEl(editTvView);
  },

  searchResults: function (data) {
    var searchView = new Clickster.Views.Search({ params: data });
    this._swapRootEl(searchView);
  },

  userShow: function (username) {
    var user;

    if (Clickster.currentUser.get("username") === username) {
      user = Clickster.currentUser;
    } else {
      user = Clickster.users.getOrFetch(username);
    }

    var userView = new Clickster.Views.UserShowView({ user: user });
    this._swapRootEl(userView);
  },

  userEdit: function () {
    var userEditView = new Clickster.Views.UserEditView();
    this._swapRootEl(userEditView);
  },

  genreShow: function (genre) {
    var genreShowView = new Clickster.Views.GenreShowView({ genre: genre });
    this._swapRootEl(genreShowView);
  },

  _swapRootEl: function (view) {
    this._swapView({
      currentView: this.currentView,
      view: view,
      $el: this.$rootEl
    });
  },

  _swapView: function (options) {
    options.currentView && options.currentView.remove();
    options.currentView = options.view;
    options.$el.html(options.view.render().$el);
  }
});
