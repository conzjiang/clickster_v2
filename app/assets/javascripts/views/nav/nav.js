Clickster.Views.Nav = Backbone.View.extend({
  initialize: function () {
    Clickster.searchResults = new Clickster.Collections.SearchResults();

    this.listenTo(Clickster.currentUser, "sync", this.render);
  },

  template: JST["nav/nav"],

  events: {
    "click #open-search": "toggleSearch",
    "click #sign-in-button": "toggleSignIn",
    "click #open-dropdown": "toggleMenu"
  },

  toggleSearch: function () {
    var options = {
      View: Clickster.Views.SearchFormView,
      class: "search",
      otherClass: "sign-in dropdown"
    };

    this._togglePopout(options);
  },

  toggleSignIn: function () {
    var options = {
      View: Clickster.Views.SignInView,
      class: "sign-in",
      otherClass: "search dropdown"
    };

    this._togglePopout(options);
  },

  toggleMenu: function () {
    var options = {
      View: Clickster.Views.DropdownView,
      class: "dropdown",
      otherClass: "search sign-in"
    };

    this._togglePopout(options);
  },

  render: function () {
    var signedIn = !!Clickster.currentUser.id;
    var content = this.template({ signedIn: signedIn });

    this.$el.html(content);
    return this;
  },

  _togglePopout: function (options) {
    var $popout = this.$(".pop-out");
    $popout.removeClass(options.otherClass).toggleClass(options.class);
    $popout.removeClass("transition");
    $(".cover").removeClass("show");

    if ($popout.hasClass(options.class)) {
      var popoutView = new options.View();
      this._swapPopout(popoutView);
    }
  },

  _swapPopout: function (view) {
    var that = this;

    if (this._currentPopout) this._currentPopout.remove();
    this._currentPopout = view;
    this.$(".pop-out").append(this._currentPopout.render().$el);
    this._currentPopout.$("input.first").focus();

    setTimeout(function () {
      that.$(".pop-out").addClass("transition");
      $(".cover").addClass("show");
    }, 0);

    this._setUpClickListener();
  },

  _setUpClickListener: function () {
    var that = this;

    $("body").on("click", function () {
      var notFirstClick = !$(event.target).is("button.nav");
      var clickedNavLink = !!$(event.target).closest(".dropdown").length;
      var outsideNav = !$(event.target).closest("nav").length;

      if ((notFirstClick && clickedNavLink) || outsideNav) {
        that.$(".pop-out").removeClass("transition search sign-in dropdown");
        $(".cover").removeClass("show");
        $(this).off("click");
      }
    });
  },

  remove: function () {
    if (this._currentPopout) this._currentPopout.remove();
    $("body").off("click");
    return Backbone.View.prototype.remove.apply(this);
  }
});
