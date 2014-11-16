(function (root) {
  var Utils = root.Utils = root.Utils || {};

  // converts lowercased snakecase to capitalized words
  Utils.convertToWords = function (string) {
    var capitalizeFirstLetter = string.charAt(0).toUpperCase();
    var unSnakeCase = string.replace(/\_/g, ' ').slice(1);
    return capitalizeFirstLetter + unSnakeCase;
  };
})(this);
