(function ($) {
  var totalHeight = function ($els) {
    var sum = 0;

    $els.each(function () {
      sum += $(this).outerHeight();
    });

    return sum;
  };

  var ellipse = function () {
    var hit, $lastChild, that;

    $lastChild = $(this).children().last();
    this.originalText = this.originalText || $lastChild.text();
    that = this;

    while (!hit || (totalHeight($(this).children()) > $(this).height())) {
      $lastChild.text(function (i, text) {
        if (!hit) text = that.originalText;
        return text.replace(/\W*\s(\S)*$/, '...');
      });

      hit = true;
    }
  };

  $.fn.ellipsis = function () {
    this.each(function () {
      ellipse.call(this);
    });

    $(window).on("resize", function () {
      this.each(function () {
        ellipse.call(this);
      });
    }.bind(this));
  };

  Backbone.View.prototype.ellipsis = function (el) {
    var remove = this.remove.bind(this);

    this.$ellipse = this.$(el || ".content");
    this.$ellipse.ellipsis();

    _.extend(this, {
      remove: function () {
        $(window).off("resize");
        remove();
      }
    });
  };
})(jQuery);