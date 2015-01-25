(function ($) {
  $.ScaleAndFade = function (el) {
    this.$el = $(el);
    this.$scaler = this.$el.clone().addClass("to-scale");
    this.setup();
  };

  $.ScaleAndFade.prototype.setup = function () {
    var width = this.$el.css("width"),
        height = this.$el.css("height");

    this.$el.addClass("scale-and-fade");

    if (this.$el.css("position") === "static") {
      this.$el.addClass("position");
    }

    this.$scaler.css({
      width: width,
      height: height
    });
  };

  $.ScaleAndFade.prototype.scale = function (callback) {
    var transitioning, $scaler = this.$scaler, that = this;

    this.$el.append($scaler);

    setTimeout(function () {
      $scaler.addClass("scale");
    }, 0);

    $scaler.on("transitionend", function () {
      // need to wait until both transitions are finished
      if (!transitioning) {
        transitioning = true;
      }

      if (transitioning) {
        $(this).off("transitionend");
        if (callback) callback(that.$el);
        that.reset();
      }
    });
  };

  $.ScaleAndFade.prototype.reset = function () {
    this.$el.removeClass("scale-and-fade position");
    this.$scaler.remove();
  };

  $.fn.scaleAndFade = function (callback) {
    return this.each(function () {
      new $.ScaleAndFade(this).scale(callback);
    });
  };
})(jQuery);