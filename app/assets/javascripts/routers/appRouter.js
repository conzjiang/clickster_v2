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
    'session/new': 'signIn',
    'users/new': 'signIn',
    'tv/new': 'newTv',
    'tv/:id': 'tvShow',
    'search': 'searchResults'
  },

  home: function () {
    var homeView = new Clickster.Views.Home();
    this._swapRootEl(homeView);
  },

  signIn: function () {
    var path, options, signInModal;

    path = window.location.hash.substring(2);
    options = {};
    if (/^users/.test(path)) options.newUser = true;

    signInModal = new Clickster.Views.SignIn(options);
    this._swapModal(signInModal);
    signInModal.$('input').eq(0).focus();
  },

  newTv: function () {
    if (Clickster.currentUser.get('is_admin')) {
      var newTvView = new Clickster.Views.NewTv();
      this._swapRootEl(newTvView);
    }
  },

  tvShow: function (id) {
    var tv = Clickster.tvShows.getOrFetch(id);
    var tvShowView = new Clickster.Views.TvShow({ tv: tv });
    this._swapRootEl(tvShowView);
  },

  searchResults: function (data) {
    var searchView = new Clickster.Views.Search({ params: data });
    this._swapRootEl(searchView);
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
