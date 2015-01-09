(function ($) {
  var totalHeight = function ($els) {
    var sum = 0;

    $els.each(function () {
      sum += $(this).outerHeight();
    });

    return sum;
  };

  $.fn.ellipsis = function () {
    this.interval = setInterval(function () {
      this.each(function () {
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
      });
    }.bind(this), 500);
  }
})(jQuery);