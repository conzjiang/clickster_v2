Qliqster.EventManager = function (options) {
  _.extend(this, Backbone.Events);
  this.clickNamespace = 0;
  this.$el = options.$el;

  this.on("signIn", this.signInError, this);
  this.on("search", this.openSearch, this);
  this.on("offSearch", this.closeSearch, this);
};

Qliqster.EventManager.prototype.signInError = function () {
  this.showError("Please sign in first.");
};

Qliqster.EventManager.prototype.showError = function (message) {
  this.$el.addClass("show");
  this.$el.html(message);

  $("main").on("scroll.onError", function (e) {
    if ($(e.currentTarget).scrollTop() === 0) {
      this.removeError();
    }
  }.bind(this));

  setTimeout(this.removeError.bind(this), 2000);
};

Qliqster.EventManager.prototype.removeError = function () {
  this.$el.removeClass("show");
  this.$el.empty();
  $("main").off("scroll.onError");
};

Qliqster.EventManager.prototype.openSearch = function () {
  $("main").addClass("cover");
  $("main > header").addClass("open-search");
};

Qliqster.EventManager.prototype.closeSearch = function () {
  $("main").removeClass("cover");
  $("main > header").removeClass("open-search");
};

Qliqster.EventManager.prototype.clickOut = function (options) {
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

Qliqster.EventManager.prototype.offClick = function (clickNamespace) {
  $("body").off(clickNamespace);
};

Qliqster.EventManager.prototype.onResize = function (callback, view) {
  $(window).on("resize." + view.cid, callback.bind(view));
};

Qliqster.EventManager.prototype.offResize = function (view) {
  $(window).off("resize." + view.cid);
};
