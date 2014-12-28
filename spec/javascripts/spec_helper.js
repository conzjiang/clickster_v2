//= require sinon
//= require application

var setUpResultsDom = function () {
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

chai.Assertion.prototype.to.have.content = function (string) {
  var view = this.__flags.object;
  this.__flags.object = view.$el.html();
  this.to.have.string(string);
};