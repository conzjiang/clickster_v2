//= require underscore
//= require convertToNums
//= require utils

describe("Utils.capitalize", function () {
  it("capitalizes the first letter of a word", function () {
    var lowercase = "conz";
    expect(Utils.capitalize(lowercase)).to.equal("Conz");
  });

  it("only capitalizes the first word when given a phrase", function () {
    var phrase = "conz is cool";
    expect(Utils.capitalize(phrase)).to.equal("Conz is cool");
  });
});

describe("Utils.hyphenate", function () {
  it("hyphenates and lowercases phrases", function () {
    var phrase = "Conz is cool";
    expect(Utils.hyphenate(phrase)).to.equal("conz-is-cool");
  });

  it("converts slashes to hyphens", function () {
    var slashes = "Sci-Fi/Fantasy";
    expect(Utils.hyphenate(slashes)).to.equal("sci-fi-fantasy");
  });
});

describe("Utils.pluralize", function () {
  it("pluralizes words", function () {
    expect(Utils.pluralize(2, "word")).to.equal("2 words");
  });

  it("doesn't pluralize singular amounts", function () {
    expect(Utils.pluralize(1, "word")).to.equal("1 word");
  });
});

describe("Utils.strip", function () {
  it("strips phrases down to the bare minimum", function () {
    var phrase = "Criminal Minds";
    expect(Utils.strip(phrase)).to.equal("criminalminds");
  });

  it("strips punctuation", function () {
    var title = "Extreme Makeover: Home Edition";
    expect(Utils.strip(title)).to.equal("extrememakeoverhomeedition");
  });

  it("converts words to numerals", function () {
    var title = "Brooklyn Nine-Nine";
    expect(Utils.strip(title)).to.equal("brooklyn99");
  });
});