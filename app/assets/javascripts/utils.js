(function (root) {
  var Utils = root.Utils = root.Utils || {};

  Utils.renderErrors = function (options) {
    var view = options.view;
    var $errorDisplay = view.$(".errors");
    var errors = options.errors;
    var fieldPrepend = options.fieldPrepend || "#";

    $errorDisplay.empty();

    for (var attr in errors) {
      var $li = $("<li>");
      $li.html(Utils.unSnakecase(attr) + " " + errors[attr][0]);
      $errorDisplay.append($li);

      view.$(fieldPrepend + attr).parent().addClass("error");
    }
  };

  Utils.strip = function (string) {
    var str = stripPunctuation(string).toLowerCase().replace(/&/g, "and");
    return convertNums(str).replace(/\s/g, "");
  };

  // converts lowercased snakecase to capitalized words
  Utils.unSnakecase = function (string) {
    var capitalizeFirstLetter = string.charAt(0).toUpperCase();
    var unSnakeCase = string.replace(/\_/g, ' ').slice(1);
    return capitalizeFirstLetter + unSnakeCase;
  };

  // helpers
  function stripPunctuation(string) {
    return string.replace(/[\.,!?:'"]/g, "").replace(/[\/\-]/g, " ").trim();
  };

  function convertNums(string) {
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

      if (digits.indexOf(100) > 0) {
        var hundred = digits.shift();
        digits[0] *= hundred;
      }

      return digits.reduce(function (sum, digit) { return sum + digit; });
    };

    var wordsToNum = function (words) {
      var thousandIndex = words.indexOf("thousand") + 1;
      var thousands = convertDigits(words.slice(0, thousandIndex));
      var hundreds = convertDigits(words.slice(thousandIndex));
      var num = thousands * 1000 + hundreds;

      return num;
    };

    var isHighDenom = function (word) {
      return word === "hundred" || word === "thousand";
    };

    var allDigits = oneDigits + twoDigits + tensDigits;

    var isNumber = function (word) {
      return isHighDenom(word) || allDigits.indexOf(word) !== -1;
    };

    var numFragments = function (words) {
      var startIndex = null;
      var fragments = [];

      _(words).each(function (word, index) {
        if (isNumber(word)) {
          if (startIndex === null) startIndex = index;
          return true;
        }

        if (startIndex !== null) {
          if (isHighDenom(words[startIndex]) && startIndex > 0) startIndex -= 1;
          fragments.push(words.slice(startIndex, index));
          startIndex = null;
        }
      });

      return fragments;
    };

    var convertNums = function (string) {
      var words = string.split(" ");

      _(numFragments(words)).each(function (numWords) {
        var wordIndex = words.indexOf(numWords[0]);

        if (numWords.length > 1) {
          words.splice(wordIndex + 1, numWords.length - 1);
        }

        if (isHighDenom(numWords[0])) numWords.unshift("one");
        words[wordIndex] = wordsToNum(numWords);
      });

      return words.join(" ");
    };

    return convertNums(string);
  };

})(this);
