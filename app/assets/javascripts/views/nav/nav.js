var allClasses = "search sign-in dropdown transition";
var minusClass = function (popOutClass) {
  var classes = allClasses.split(" ");
  var classIndex = classes.indexOf(popOutClass);

  classes.splice(classIndex, 1)
  return classes.join(" ");
};

Clickster.Views.Nav = Backbone.View.extend({
  initialize: function () {
    Clickster.searchResults = new Clickster.Collections.SearchResults();

    this.listenTo(Clickster.currentUser, "sync", this.render);
  },

  template: JST["nav/nav"],

  events: {
    "click #open-search": "toggleSearch",
    "click .tv-hamburger": "chooseMenu"
  },

  toggleSearch: function () {
    var options = {
      View: Clickster.Views.SearchFormView,
      class: "search"
    };

    this._togglePopout(options);
  },

  chooseMenu: function () {
    var signedIn = !!Clickster.currentUser.id;

    if (signedIn) {
      this.toggleMenu();
    } else {
      this.toggleSignIn();
    }
  },

  toggleMenu: function () {
    var options = {
      View: Clickster.Views.DropdownView,
      class: "dropdown"
    };

    this._togglePopout(options);
  },

  toggleSignIn: function () {
    var options = {
      View: Clickster.Views.SignInView,
      class: "sign-in"
    };

    this._togglePopout(options);
  },

  render: function () {
    var signedIn = !!Clickster.currentUser.id;
    var content = this.template();
    this.$el.html(content);

    if (signedIn) {
      this.$(".tv-hamburger").addClass("signed-in");
    }

    return this;
  },

  _togglePopout: function (options) {
    var $popout = this.$(".pop-out");
    $popout.removeClass(minusClass(options.class)).toggleClass(options.class);
    $("main").removeClass("cover");

    if ($popout.hasClass(options.class)) {
      var popoutView = new options.View();
      this._swapPopout(popoutView);
    }
  },

  _swapPopout: function (view) {
    if (this._currentPopout) this._currentPopout.remove();
    this._currentPopout = view;
    this.$(".pop-out").append(view.render().$el);
    view.$("input.first").focus();

    setTimeout(function () {
      this.$(".pop-out").addClass("transition");
    }.bind(this), 0);

    this._setUpClickListener();
  },

  _setUpClickListener: function () {
    var that = this;

    $("body").on("click", function () {
      var notFirstClick = !$(event.target).is("button.nav");
      var clickedNavLink = !!$(event.target).closest(".dropdown").length;
      var outsideNav = !$(event.target).closest("nav").length;

      if ((notFirstClick && clickedNavLink) || outsideNav) {
        that.$(".pop-out").removeClass(allClasses);
        $("main").removeClass("cover");
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
