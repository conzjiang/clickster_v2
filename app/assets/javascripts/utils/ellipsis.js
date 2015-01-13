(function ($) {
  var totalHeight = function ($els) {
    var sum = 0;

    $els.each(function () {
      if ($(this).hasClass("ignore")) return;
      sum += $(this).outerHeight();
    });

    return sum;
  };

  var ellipse = function (resized) {
    var $lastChild, that;

    if ($(this).hasClass("ignore")) return;

    $lastChild = $(this).children().last();
    this.originalText = this.originalText || $lastChild.text();
    that = this;

    while (resized || (totalHeight($(this).children()) > $(this).height())) {
      $lastChild.text(function (i, text) {
        if (resized) {
          text = that.originalText;
          resized = false;
        }

        return text.replace(/\W*\s(\S)*$/, '...');
      });
    }
  };

  $.fn.ellipsis = function () {
    this.each(function () {
      ellipse.call(this);
    });

    $(window).on("resize", function () {
      this.each(function () {
        ellipse.call(this, true);
      });
    }.bind(this));
  };

  Backbone.View.prototype.ellipsis = function (el) {
    var remove = this.remove.bind(this);

    this.$ellipse = this.$(el || ".content");
    if (!this.$ellipse.length) return;
    this.$ellipse.ellipsis();

    _.extend(this, {
      remove: function () {
        $(window).off("resize");
        remove();
      }
    });
  };
})(jQuery);