//= require underscore
//= require convertToNums

describe("Utils.convertToNums", function () {
  it("takes a string and converts its numeral words to integers", function () {
    var string = "two thousand things in the sky";
    expect(Utils.convertToNums(string)).to.equal("2000 things in the sky");
  });

  it("properly replaces numeral words in the middle of a string", function () {
    var string = "there are forty one tables";
    expect(Utils.convertToNums(string)).to.equal("there are 41 tables");
  });
});

describe("Utils.numFragments", function () {
  it("returns the number words from an array of words", function () {
    var words = "two thousand things in the sky".split(" ");
    expect(Utils.numFragments(words)).to.eql([["two", "thousand"]])
  });
});

describe("Utils.splitConsecutive", function () {
  it("splits consecutive numeral words that are not one number", function () {
    var notOneNum = ["five", "nine"];
    expect(Utils.splitConsecutive(notOneNum)).to.eql([["five"], ["nine"]])
  });

  it("doesn't split numeral words that constitute one number", function () {
    var number = ["one", "hundred", "twenty"];
    expect(Utils.splitConsecutive(number)).to.eql([number]);
  });
});

describe("Utils.wordsToNum", function () {
  it("translates an array of words to the interger it represents", function () {
    var words = ["forty", "thousand", "twenty", "five"];
    expect(Utils.wordsToNum(words)).to.equal(40025);
  });
});

describe("Utils.convertDigits", function () {
  it("converts numeral words to the integer they represent", function () {
    var words = ["forty", "five"];
    expect(Utils.convertDigits(words)).to.equal(45);
  });

  it("handles integers in the hundreds", function () {
    var words = ["three", "hundred", "thirty", "three"];
    expect(Utils.convertDigits(words)).to.equal(333);
  });
});