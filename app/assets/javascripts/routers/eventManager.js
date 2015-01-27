Clickster.EventManager = function (options) {
  _.extend(this, Backbone.Events);
  this.$el = options.$el;
  this.clickNamespace = 0;

  this.on("signIn", this.signInError, this);
};

Clickster.EventManager.prototype.signInError = function () {
  this.showError("Please sign in first.");
};

Clickster.EventManager.prototype.showError = function (message) {
  var viewportTop = $("main").scrollTop()
  this.$el.addClass("show").css({ top: (viewportTop - 50) + "px" });
  this.$el.html(message);

  setTimeout(function () {
    this.$el.css({ top: viewportTop + "px" });
  }.bind(this), 100);

  setTimeout(function () {
    this.$el.css({ top: (viewportTop - 50) + "px" });

    this.$el.one("transitionend", function () {
      this.$el.removeClass("show");
      this.$el.removeAttr("style");
    }.bind(this));
  }.bind(this), 2000);
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