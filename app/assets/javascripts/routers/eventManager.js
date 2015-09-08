Clickster.EventManager = function (options) {
  _.extend(this, Backbone.Events);
  this.clickNamespace = 0;
  this.$el = options.$el;

  this.on("signIn", this.signInError, this);
  this.on("search", this.openSearch, this);
  this.on("offSearch", this.closeSearch, this);
};

Clickster.EventManager.prototype.signInError = function () {
  this.showError("Please sign in first.");
};

Clickster.EventManager.prototype.showError = function (message) {
  this.$el.addClass("show");
  this.$el.html(message);

  $("main").on("scroll.onError", function (e) {
    if ($(e.currentTarget).scrollTop() === 0) {
      this.removeError();
    }
  }.bind(this));

  setTimeout(this.removeError.bind(this), 2000);
};

Clickster.EventManager.prototype.removeError = function () {
  this.$el.removeClass("show");
  this.$el.empty();
  $("main").off("scroll.onError");
};

Clickster.EventManager.prototype.openSearch = function () {
  $("main").addClass("cover");
  $("main > header").addClass("open-search");
};

Clickster.EventManager.prototype.closeSearch = function () {
  $("main").removeClass("cover");
  $("main > header").removeClass("open-search");
};

Clickster.EventManager.prototype.clickOut = function (options) {
  var clickNamespace = "click." + this.clickNamespace,
      firstClick = true,
      isOutside = options.isOutside,
      callback = options.callback,
      that = this;

  this.clickNamespace++;

  $("body").on(clickNamespace, function (e) {
    if (firstClick) {
      firstClick = false;
      return;
    }

    if (isOutside($(e.target))) callback();
    that.offClick(clickNamespace);
  });
};

Clickster.EventManager.prototype.offClick = function (clickNamespace) {
  $("body").off(clickNamespace);
};

Clickster.EventManager.prototype.onResize = function (callback, view) {
  $(window).on("resize." + view.cid, callback.bind(view));
};

Clickster.EventManager.prototype.offResize = function (view) {
  $(window).off("resize." + view.cid);
};
