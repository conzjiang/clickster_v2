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
    "click .surf": "toggleSearch",
    "click .guide": "chooseMenu"
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
    var content = this.template({ signedIn: signedIn });
    this.$el.html(content);

    if (signedIn) {
      this.$(".tv-hamburger").addClass("signed-in");
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
      this.$(".profile-button").addClass("no-image");
    }
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
    var firstClick = true;

    $("body").on("click", function (event) {
      if (firstClick) {
        firstClick = false;
        return;
      }
      var $target = $(event.target);
      var otherNav = $target.is(".profile-button") || $target.is(".logo");
      var clickedDropdown = !!$target.closest(".dropdown").length;
      var outsideNav = !$target.closest("nav").length;

      if (otherNav || clickedDropdown || outsideNav) {
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
