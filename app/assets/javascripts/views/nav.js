Clickster.Views.Nav = Backbone.View.extend({
  initialize: function () {
    this.listenTo(Clickster.currentUser, "sync", this.render);
  },

  template: JST["nav"],

  events: {
    "click #open-search": "openSearch",
    "click #sign-in-button": "openSignIn"
  },

  openSearch: function () {
    this.$(".pop-out").toggleClass("search");
    var searchView = new Clickster.Views.SearchFormView();
    this._swapPopout(searchView);
  },

  openSignIn: function () {
    this.$(".pop-out").toggleClass("sign-in");
    var signInView = new Clickster.Views.SignInView();
    this._swapPopout(signInView);
  },

  toggleMenu: function (e) {
    var that = this;
    $(event.target).toggleClass("open");

    $("body").on("click", function () {
      var outsideNav = !$(event.target).closest(".links").length;
      var clickedNavLink = !!$(event.target).closest(".dropdown").length;

      if (outsideNav || clickedNavLink) {
        that.closeMenu();
        $(this).off("click");
      }
    });
  },

  closeMenu: function () {
    this.$("figure").removeClass("open");
  },

  render: function () {
    var signedIn = !!Clickster.currentUser.id;

    var content = this.template({
      signedIn: signedIn
    });

    this.$el.html(content);
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
  },

  remove: function () {
    if (this._searchView) this._searchView.remove();
    return Backbone.View.prototype.remove.apply(this);
  }
});
