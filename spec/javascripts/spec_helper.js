//= require sinon
//= require application

var appendToBody, setUpResultsDom, Assertion;

appendToBody = function ($el) {
  $("#konacha").append($el);
};

setUpResultsDom = function () {
  $("#konacha").html("<p id='tv_shows'></p><p id='users'></p>");

  $("#tv_shows").html(JSON.stringify([
    { id: 1, title: "Brooklyn Nine-Nine", pattern: "Brooklyn Nine-Nine" },
    { id: 2, title: "Orphan Black", pattern: "Orphan Black" },
    { id: 3, title: "A Pizza Place", pattern: "A Pizza Place" }
  ]));

  $("#users").html(JSON.stringify([
    { id: 1, pattern: "conz" },
    { id: 2, pattern: "pizza" }
  ]));
};

Assertion = chai.Assertion;
Assertion.addMethod("content", function (string) {
  var view = this._obj;

  new Assertion(view).to.be.instanceof(Backbone.View);
  this.assert(
    !!view.$el.html().match(string),
    "expected object to be of type Backbone.View but got #{act}",
    "expected view to have content '#{exp}'",
    string, // exp
    view._type // act
  );
});

// chai.Assertion.prototype.to.have.content = function (string) {
//   var view = this.__flags.object;
//   this.__flags.object = view.$el.html();
//   this.to.have.string(string);
// };