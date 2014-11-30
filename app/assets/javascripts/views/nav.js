Clickster.Views.Nav = Backbone.View.extend({
  initialize: function () {
    Clickster.searchResults = new Clickster.Collections.SearchResults();

    this.listenTo(Clickster.currentUser, "sync", this.render);
  },

  template: JST["nav"],

  events: {
    "click #open-search": "toggleSearch",
    "click #sign-in-button": "toggleSignIn",
    "click #open-dropdown": "toggleMenu"
  },

  toggleSearch: function () {
    var options = {
      View: Clickster.Views.SearchFormView,
      class: "search",
      otherClass: "sign-in"
    };

    this._togglePopout(options);
  },

  toggleSignIn: function () {
    var options = {
      View: Clickster.Views.SignInView,
      class: "sign-in",
      otherClass: "search"
    };

    this._togglePopout(options);
  },

  toggleMenu: function () {
    var options = {
      View: Clickster.Views.DropdownView,
      class: "dropdown",
      otherClass: "search"
    };

    this._togglePopout(options);
  },

  render: function () {
    var signedIn = !!Clickster.currentUser.id;
    var content = this.template({ signedIn: signedIn });

    this.$el.html(content);
    return this;
  },

  _swapPopout: function (view) {
    var that = this;

    if (this._currentPopout) this._currentPopout.remove();
    this._currentPopout = view;
    this.$(".pop-out").append(this._currentPopout.render().$el);
    this._currentPopout.$("input.first").focus();

    $("body").on("click", function () {
      var notFirstClick = !$(event.target).is("button.nav");
      var clickedNavLink = !!$(event.target).closest(".dropdown").length;
      var outsideNav = !$(event.target).closest("nav").length;

      if ((notFirstClick && clickedNavLink) || outsideNav) {
        that.$(".pop-out").removeClass("search sign-in dropdown");
        $(this).off("click");
      }
    });
  },

  _togglePopout: function (options) {
    var $popout = this.$(".pop-out");
    $popout.removeClass(options.otherClass).toggleClass(options.class);

    if ($popout.hasClass(options.class)) {
      var popoutView = new options.View();
      this._swapPopout(popoutView);
    }
  },

  remove: function () {
    if (this._currentPopout) this._currentPopout.remove();
    return Backbone.View.prototype.remove.apply(this);
  }
});
