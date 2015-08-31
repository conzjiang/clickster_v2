Clickster.allClasses = "search sign-in dropdown transition";
Clickstser.minusClass = function (popOutClass) {
  var classes = this.allClasses.split(" ");
  var classIndex = classes.indexOf(popOutClass);

  classes.splice(classIndex, 1);
  return classes.join(" ");
};

Clickster.Views.Nav = Backbone.View.extend({
  initialize: function () {
    Clickster.searchResults = new Clickster.Collections.SearchResults();

    this.listenTo(Clickster.currentUser, "sync", this.render);
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
      View: Clickster.Views.SearchFormView,
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
    this.$(".pop-out").removeClass(Clickster.allClasses);
  },

  _closeSearch: function () {
    Clickster.eventManager.trigger("offSearch");
  },

  goToProfile: function () {
    var username = Clickster.currentUser.get("username");
    Backbone.history.navigate("users/" + username, { trigger: true });
  },

  chooseMenu: function () {
    this.$el.addClass("relative");

    if (Clickster.currentUser.signedIn()) {
      this.toggleMenu();
    } else {
      this.toggleSignIn();
    }

    this._setUpClickListener();
  },

  toggleMenu: function () {
    this._togglePopout({
      View: Clickster.Views.DropdownView,
      className: "dropdown"
    });
  },

  _togglePopout: function (options) {
    var $popout = this.$(".pop-out");

    $popout.
      removeClass(Clickster.minusClass(options.className)).
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
    this.$(".pop-out").append(view.render().$el);
    view.onRender && view.onRender();

    setTimeout(function () {
      this.$(".pop-out").addClass("transition");
    }.bind(this), 0);
  },

  toggleSignIn: function () {
    this._togglePopout({
      View: Clickster.Views.SignInView,
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
      signedIn: Clickster.currentUser.signedIn()
    });
    this.$el.html(content);

    if (Clickster.currentUser.signedIn()) {
      this.$(".tv-hamburger").addClass("signed-in");
      this.$(".nav-triangle").addClass("signed-in");
      this._renderProfileImage();
    }

    return this;
  },

  _renderProfileImage: function () {
    var imageUrl = Clickster.currentUser.escape("image_url");

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
