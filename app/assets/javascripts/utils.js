(function (root) {
  var Utils = root.Utils = root.Utils || {};

  var matchesAnd = function (query, string) {
    var and = string.match(/\sand\s/);
    var ampersand = string.match(/\s&\s/);
    var match, matchesAnd;

    if (and) {
      match = string.replace(/\sand\s/, " & ");
    } else if (ampersand) {
      match = string.replace(/\s&\s/, " and ");
    }

    if (match) matchesAnd = query.test(match);

    return matchesAnd;
  };

  // converts lowercased snakecase to capitalized words
  Utils.convertToWords = function (string) {
    var capitalizeFirstLetter = string.charAt(0).toUpperCase();
    var unSnakeCase = string.replace(/\_/g, ' ').slice(1);
    return capitalizeFirstLetter + unSnakeCase;
  };

  Utils.match = function (searchTerm, string) {
    var query = new RegExp(this.strip(searchTerm), "i");
    var matchStr = this.strip(string);
    var isDirectMatch = query.test(matchStr);

    return isDirectMatch || matchesAnd(query, matchStr);
  };

  Utils.strip = function (string) {
    return this.stripPunctuation(string).replace(/[0-9]/g, "#");
  };

  Utils.stripPunctuation = function (string) {
    return string.replace(/[\.,!?:'"]/g, "").replace(/\/\-/g, " ").trim();
  };
})(this);
