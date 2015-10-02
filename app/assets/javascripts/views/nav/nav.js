Qliqster.allClasses = "search sign-in dropdown transition";
Qliqster.minusClass = function (popOutClass) {
  var classes = this.allClasses.split(" ");
  var classIndex = classes.indexOf(popOutClass);

  classes.splice(classIndex, 1);
  return classes.join(" ");
};

Qliqster.Views.Nav = Backbone.View.extend({
  initialize: function () {
    Qliqster.searchResults = new Qliqster.Collections.SearchResults();

    this.listenTo(Qliqster.currentUser, "sync", this.render);
  },

  template: JST["nav/nav"],

  events: {
    "click .surf": "toggleSearch",
    "click .profile": "goToProfile",
    "click .guide": "chooseMenu"
  },

  toggleSearch: function () {
    this.$el.removeClass("relative");

    this._togglePopout({
      View: Qliqster.Views.SearchFormView,
      className: "search"
    });

    this._bindCoverClick();
  },

  _bindCoverClick: function () {
    var firstClick;

    $(".cover").one("click", function () {
      if (!firstClick) {
        firstClick = true;
        return;
      }

      this._closePopout();
      this._closeSearch();
    }.bind(this));
  },

  _closePopout: function () {
    this.$(".pop-out").removeClass(Qliqster.allClasses);
  },

  _closeSearch: function () {
    Qliqster.eventManager.trigger("offSearch");
  },

  goToProfile: function () {
    var username = Qliqster.currentUser.get("username");
    Backbone.history.navigate("users/" + username, { trigger: true });
  },

  chooseMenu: function () {
    this.$el.addClass("relative");

    if (Qliqster.currentUser.signedIn()) {
      this.toggleMenu();
    } else {
      this.toggleSignIn();
    }

    this._setUpClickListener();
  },

  toggleMenu: function () {
    this._togglePopout({
      View: Qliqster.Views.DropdownView,
      className: "dropdown"
    });
  },

  _togglePopout: function (options) {
    var $popout = this.$(".pop-out");

    $popout.
      removeClass(Qliqster.minusClass(options.className)).
      toggleClass(options.className);

    this._closeSearch();

    if ($popout.hasClass(options.className)) {
      var popoutView = new options.View();
      this._swapPopout(popoutView);
    }
  },

  _swapPopout: function (view) {
    if (this._currentPopout) this._currentPopout.remove();
    this._currentPopout = view;
    this.$(".pop-out").append(view.$el);
    view.render();

    setTimeout(function () {
      this.$(".pop-out").addClass("transition");
    }.bind(this), 0);
  },

  toggleSignIn: function () {
    this._togglePopout({
      View: Qliqster.Views.SignInView,
      className: "sign-in"
    });
  },

  _setUpClickListener: function () {
    var that = this;
    var firstClick = true;

    $("body").on("click", function (event) {
      if (firstClick) {
        firstClick = false;
        return;
      }
      var $target = $(event.target);
      var otherNav = $target.closest(".nav-link").length;
      var clickedDropdown = !!$target.closest(".dropdown").length;
      var outsideNav = !$target.closest("nav").length;

      if (otherNav || clickedDropdown || outsideNav) {
        that._closePopout();
        $(this).off("click");
      }
    });
  },

  render: function () {
    var content = this.template({
      user: Qliqster.currentUser,
      signedIn: Qliqster.currentUser.signedIn()
    });
    this.$el.html(content);

    if (Qliqster.currentUser.signedIn()) {
      this.$(".tv-hamburger").addClass("signed-in");
      this.$(".nav-triangle").addClass("signed-in");
      this._renderProfileImage();
    }

    return this;
  },

  _renderProfileImage: function () {
    var imageUrl = Qliqster.currentUser.escape("image_url");

    if (imageUrl) {
      this.$(".profile-button").css({
        "background-image": "url('" + imageUrl + "')"
      });
    } else {
      this.$(".profile-button").addClass("icon-no-user-image");
    }
  },

  remove: function () {
    if (this._currentPopout) this._currentPopout.remove();
    $("body").off("click");
    Backbone.View.prototype.remove.call(this);
  }
});
