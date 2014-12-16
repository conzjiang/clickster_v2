Clickster.Routers.AppRouter = Backbone.Router.extend({
  initialize: function (options) {
    this.$navbar = options.$navbar;
    this.$rootEl = options.$rootEl;
    this.$modal = options.$modal;

    var navbarView = new Clickster.Views.Nav({ el: this.$navbar });
    navbarView.render();

    this.bindEvents();
  },

  routes: {
    '': 'home',
    'tv': 'tvIndex',
    'tv/new': 'newTv',
    'tv/:id/edit': 'editTv',
    'tv/:id': 'tvShow',
    'search': 'searchResults',
    'users/:username': 'userShow'
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

  bindEvents: function () {
    $('.overlay').on('click', function () {
      $('.modal').addClass('fading-out');

      $('.modal').one('transitionend', function () {
        $(this).removeClass('display');
        Backbone.history.navigate('');
      });
    });
  },

  _swapRootEl: function (view) {
    $('.modal').removeClass('display');

    this._swapView({
      currentView: this.currentView,
      view: view,
      $el: this.$rootEl
    });
  },

  _swapModal: function (view) {
    $('.modal').removeClass('fading-out').addClass('display');

    this._swapView({
      currentView: this.modalView,
      view: view,
      $el: this.$modal
    });
  },

  _swapView: function (options) {
    options.currentView && options.currentView.remove();
    options.currentView = options.view;
    options.$el.html(options.view.render().$el);
  }
});
