Clickster.ErrorManager = function (options) {
  _.extend(this, Backbone.Events);
  this.$el = options.$el;

  this.on("signIn", this.signInError, this);
};

Clickster.ErrorManager.prototype.signInError = function () {
  this.showError("Please sign in first.");
};

Clickster.ErrorManager.prototype.showError = function (message) {
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