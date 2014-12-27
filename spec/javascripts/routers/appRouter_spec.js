//= require application

describe("App Router", function () {
  var router;

  beforeEach(function () {
    $("#konacha").html("<p id='nav'></p><p id='root'></p>");
    $("#konacha").append("<p id='tv_shows'>[]</p><p id='users'>[]</p>");

    Clickster.currentUser = new Backbone.Model();
    router = new Clickster.Routers.AppRouter({
      $navbar: $("#nav"),
      $rootEl: $("#root")
    });
  });

  it("initializes with an empty currentViews object", function () {
    expect(router.currentViews).to.be.empty;
  });

  it("renders Nav view into the given nav $el", function () {
    expect($("#nav")).not.to.be.empty;
  });


});