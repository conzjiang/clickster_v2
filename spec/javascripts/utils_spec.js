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

// see User edit view spec for Utils.renderErrors test

describe("Utils.strip", function () {
  it("strips phrases down to the bare minimum", function () {
    var title = "Criminal Minds";
    expect(Utils.strip(title)).to.equal("criminalminds");
  });

  it("strips punctuation", function () {
    var title = "Extreme Makeover: Home Edition";
    expect(Utils.strip(title)).to.equal("extrememakeoverhomeedition");
  });

  it("replaces ampersands with `and`", function () {
    var title = "Law & Order: SVU";
    expect(Utils.strip(title)).to.equal("lawandordersvu");
  });

  it("converts words to numerals", function () {
    var title = "Brooklyn Nine-Nine";
    expect(Utils.strip(title)).to.equal("brooklyn99");
  });
});

describe("Utils.stripAll", function () {
  it("takes an array of objects and strips their patterns", function () {
    var objs = [
      { id: 1, pattern: "Two Guys & a Girl" },
      { id: 2, pattern: "Fun" }
    ];
    var strippedAll = Utils.stripAll(objs);

    expect(strippedAll[0].pattern).to.equal("2guysandagirl");
    expect(strippedAll[1].pattern).to.equal("fun");
  });
});

describe("Utils.unSnakeCase", function () {
  it("converts a snakecased string to a capitalized string", function () {
    expect(Utils.unSnakeCase("new_password")).to.equal("New password");
  });
});