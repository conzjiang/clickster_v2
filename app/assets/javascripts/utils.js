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

  var oneDigits = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine"
  ];
  var twoDigits = [
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen"
  ];
  var tensDigits = [
    "ten",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety"
  ];

  var convertDigits = function (digitWords) {
    if (digitWords.length === 0) return 0;

    var digits = _(digitWords).map(function (digit, index) {
      var onesDigit = oneDigits.indexOf(digit);
      var twoDigit = twoDigits.indexOf(digit);
      var tensDigit = tensDigits.indexOf(digit);

      if (onesDigit !== -1) {
        return onesDigit;
      } else if (twoDigit !== -1) {
        return twoDigit + 11;
      } else if (tensDigit !== -1) {
        return (tensDigit + 1) * 10;
      } else if (digit === "hundred") {
        return 100;
      }

      return 0;
    });

    if (digits.indexOf(100) !== -1) {
      var hundred = digits.shift();
      digits[0] *= hundred;
    }

    return digits.reduce(function (memo, digit) { return memo + digit; });
  };

  var wordsToNum = function (word) {
    var words = word.split(" ");
    var thousandIndex = words.indexOf("thousand") + 1;

    var thousands = convertDigits(words.slice(0, thousandIndex));
    var hundreds = convertDigits(words.slice(thousandIndex));
    var num = thousands * 1000 + hundreds;

    return num;
  };

  var consecutiveFragments = function (arr) {
    var startIndex = null;
    var endIndex;
    var fragments = [];

    _(arr).each(function (num, index) {
      if (num + 1 == arr[index + 1] && startIndex === null) {
        startIndex = index;
      } else if (startIndex) {
        endIndex = index + 1;
        fragments.push(arr.slice(startIndex, endIndex));
        startIndex = null;
      } else {
        fragments.push([num]);
      }
    });

    return fragments;
  };

  var matchesNums = function (query, string) {
    var words = string.split(" ");
    var digits = oneDigits + twoDigits + tensDigits;
    var digitIndices = words.map(function (word, index) {
      if (digits.indexOf(word) === -1) return -1;
      return index;
    }).filter(function (el) { return el !== -1; });

    _(consecutiveFragments(digitIndices)).each(function (indexArr) {
      var stringFragment = words.slice(indexArr[0], indexArr.slice(-1) + 1);
      if (stringFragment.indexOf("hundred") === 0 ||
          stringFragment.indexOf("thousand") === 0) {
        stringFragment.unshift("one");
      }

      words[indexArr[0]] = wordsToNum(stringFragment);
      if (indexArr.length > 1) words.splice(indexArr[1], indexArr.length);
    });
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
