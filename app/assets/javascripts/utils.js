(function (root) {
  var Utils = root.Utils = root.Utils || {};

  Utils.capitalize = function (string) {
    var firstLetter = string.charAt(0).toUpperCase();
    return firstLetter + string.slice(1);
  };

  Utils.dehyphenate = function (hyphenated) {
    var exceptions = Clickster.genreExceptions;
    if (_(exceptions).has(hyphenated)) return exceptions[hyphenated];
    return Utils.capitalize(hyphenated.replace(/-/g, " "));
  };

  Utils.hyphenate = function (string) {
    return string.toLowerCase().replace(/[\s\/]/g, "-");
  };

  var imageTileColors = Utils.imageTileColors = [];
  var hue = 30;

  while (imageTileColors.length < 6) {
    var array = [hue, hue, hue, 0.7];
    imageTileColors.push("rgba(" + array.join(", ") + ")");
    hue += 30;
  }

  Utils.pluralize = function (num, word) {
    var singular = num + " " + word;
    if (num === 1) return singular;
    return singular + "s";
  };

  Utils.renderErrors = function (options) {
    var view = options.view;
    var $errorDisplay = view.$(".errors");
    var errors = options.errors;
    var fieldPrepend = options.fieldPrepend || "#";

    $errorDisplay.empty();

    for (var attr in errors) {
      var $li = $("<li>");
      $li.html(Utils.unSnakeCase(attr) + " " + errors[attr][0]);
      $errorDisplay.append($li);

      view.$(fieldPrepend + attr).parent().addClass("error");
    }
  };

  Utils.strip = function (string) {
    var str = stripPunctuation(string).toLowerCase().replace(/&/g, "and");
    return Utils.convertToNums(str).replace(/\s/g, "");
  };

  Utils.stripAll = function (items) {
    _(items).each(function (item) {
      item.pattern = Utils.strip(item.pattern);
    });

    return items;
  };

  // converts lowercased snakecase to capitalized words
  Utils.unSnakeCase = function (string) {
    return Utils.capitalize(string.replace(/\_/g, ' '));
  };

  // helpers
  function stripPunctuation(string) {
    return string.replace(/[\.,!?:'"]/g, "").replace(/[\/\-]/g, " ").trim();
  };
})(this);
