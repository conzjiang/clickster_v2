(function (root) {
  var Utils = root.Utils = root.Utils || {};

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

  var isHighDenom = function (word) {
    return word === "hundred" || word === "thousand";
  };

  var allDigits = oneDigits.concat(twoDigits).concat(tensDigits);

  var isNumber = function (word) {
    return isHighDenom(word) || allDigits.indexOf(word) !== -1;
  };

  Utils.convertToNums = function(string) {
    var words = string.split(" ");

    _(Utils.numFragments(words)).each(function (numWords) {
      var wordIndex = words.indexOf(numWords[0]);

      if (numWords.length > 1) {
        words.splice(wordIndex + 1, numWords.length - 1);
      }

      if (isHighDenom(numWords[0])) numWords.unshift("one");
      words[wordIndex] = Utils.wordsToNum(numWords);
    });

    return words.join(" ");
  };

  Utils.numFragments = function (words) {
    var startIndex = null;
    var fragments = [];

    var addToFragments = function (start, index) {
      if (start !== null) {
        if (isHighDenom(words[start]) && start > 0) start -= 1;
        var split = Utils.splitConsecutive(words.slice(start, index));
        fragments = fragments.concat(split);
        startIndex = null;
      }
    };

    _(words).each(function (word, index) {
      if (isNumber(word)) {
        if (startIndex === null) startIndex = index;
        return true;
      }

      addToFragments(startIndex, index);
    });

    addToFragments(startIndex, words.length);

    return fragments;
  };

  Utils.splitConsecutive = function (numWords) {
    var allDigits = [oneDigits, twoDigits, tensDigits];
    var split = [];
    var lastIndex = 0;

    numWords.reduce(function (memo, word, index) {
      var sameDigit = allDigits.some(function (digits) {
        return digits.indexOf(memo) !== -1 && digits.indexOf(word) !== -1;
      });

      if (sameDigit) {
        split.push(numWords.slice(lastIndex, index));
        lastIndex = index;
      }
    });

    if (lastIndex < numWords.length) split.push(numWords.slice(lastIndex));
    return split;
  };

  Utils.wordsToNum = function (words) {
    var thousandIndex = words.indexOf("thousand") + 1;
    var thousands = Utils.convertDigits(words.slice(0, thousandIndex));
    var hundreds = Utils.convertDigits(words.slice(thousandIndex));
    var num = thousands * 1000 + hundreds;

    return num;
  };

  Utils.convertDigits = function (digitWords) {
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
})(this);