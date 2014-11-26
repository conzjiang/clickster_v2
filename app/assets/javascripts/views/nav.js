Clickster.Views.Nav = Backbone.View.extend({
  initialize: function () {
    Clickster.searchResults = new Clickster.Collections.SearchResults();

    this.listenTo(Clickster.currentUser, "sync", this.render);
  },

  template: JST["nav"],

  events: {
    "click #open-search": "openSearch",
    "click #sign-in-button": "openSignIn",
    "click #open-dropdown": "toggleMenu"
  },

  openSearch: function () {
    this.$(".pop-out").removeClass("sign-in").toggleClass("search");
    var searchView = new Clickster.Views.SearchFormView();
    this._swapPopout(searchView);
  },

  openSignIn: function () {
    this.$(".pop-out").removeClass("search").toggleClass("sign-in");
    var signInView = new Clickster.Views.SignInView();
    this._swapPopout(signInView);
  },

  toggleMenu: function (e) {
    var that = this;
    var $dropdownMenu = this.$("ul.dropdown");

    $dropdownMenu.toggleClass("open");

    if ($dropdownMenu.hasClass("open")) {
      $("body").on("click", function () {
        var outsideNav = !$(event.target).closest("nav").length;
        var clickedNavLink = !!$(event.target).closest(".dropdown").length;

        if (outsideNav || clickedNavLink) {
          that.toggleMenu();
          $(this).off("click");
        }
      });
    }
  },

  render: function () {
    var signedIn = !!Clickster.currentUser.id;
    var isAdmin = Clickster.currentUser.get("is_admin");

    var content = this.template({
      signedIn: signedIn,
      isAdmin: isAdmin
    });

    this.$el.html(content);
    if (isAdmin) this.$(".dropdown").addClass("admin");
    return this;
  },

  searchView: function () {
    this._searchView = this._searchView || new Clickster.Views.SearchFormView();
    return this._searchView;
  },

  _swapPopout: function (view) {
    if (this._currentPopout) this._currentPopout.remove();
    this._currentPopout = view;
    this.$(".pop-out").append(this._currentPopout.render().$el);
    this._currentPopout.$("input.first").focus();
  },

  remove: function () {
    if (this._searchView) this._searchView.remove();
    return Backbone.View.prototype.remove.apply(this);
  }
});
