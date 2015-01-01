//= require spec_helper

describe("TV form view", function () {
  var tv, newView, editView, event;

  beforeEach(function () {
    tv = new Clickster.Models.TvShow({ title: "Broad City" });
    newView = new Clickster.Views.TvFormView({ tv: tv, action: "new" });
    editView = new Clickster.Views.TvFormView({ tv: tv, action: "edit" });
    event = { preventDefault: function(){}, target: "form" };
  });

  it("sets values properly upon initialization", function () {
    expect(newView.values.formHeader).to.equal("Add Manually");
    expect(editView.values.buttonContent).to.equal("Update Series");
  });

  describe("#render", function () {
    it("renders form template", function () {
      expect(newView.render()).to.have.content("Add Manually");
    });

    it("preselects genres", function () {
      Clickster.GENRES = ["Comedy", "Romance", "Drama"];
      tv.set("genres", ["Comedy"]);
      newView.render();

      expect(newView.$("input[value=Comedy]").is(":checked")).to.be.true;
      expect(newView.$("input[value=Drama]").is(":checked")).to.be.false;
    });

    it("preselects status", function () {
      Clickster.TV_STATUSES = ["Current", "Ended"];
      tv.set("status", "Ended");
      newView.render();

      expect(newView.$("option[value=Ended]").is(":selected")).to.be.true;
      expect(newView.$("option[value=Current]").is(":selected")).to.be.false;
    });
  });

  describe("#uploadImage", function () {
    beforeEach(function () {
      filepicker = { pick: function(){} };
      Clickster.filepickerOptions = {};
      sinon.stub(filepicker, "pick").yields({ url: "pic.jpg" });
    });

    it("sets the TV's image url", function () {
      newView.uploadImage(event);
      expect(tv.get("image_url")).to.equal("pic.jpg");
    });

    it("injects the image into the DOM", function () {
      newView.render();
      newView.uploadImage(event);
      expect(newView.$("img").attr("src")).to.equal("pic.jpg");
    });
  });

  describe("#saveTV", function () {
    var server, tv;

    before(function () {
      server = sinon.fakeServer.create();

      // server.respondWith("POST", "/api/tv_shows", [
//         200, { "Content-Type": "application/json" }, JSON.stringify({ id: 1 })
//       ]);
    });

    after(function () {
      server.restore();
    });

    beforeEach(function () {
      setUpResultsDom();
      Clickster.currentUser = { tvShows: new Backbone.Collection() };
      Clickster.tvShows = new Backbone.Collection();
      Clickster.searchResults = new Clickster.Collections.SearchResults();
      tv = newView.tv = new Clickster.Models.TvShow({ title: "Broad City" });
    });

    it("adds new model to collections on successful save", function () {
      var searchItem;

      appendToBody(newView.render().$el);
      newView.saveTV(event);
      server.respond();
      searchItem = Clickster.searchResults.tvShows.last();

      expect(Clickster.currentUser.tvShows.models).to.contain(tv);
      expect(Clickster.tvShows.models).to.contain(tv);
      expect(searchItem.title).to.equal(tv.get("title"));
    });

    it("doesn't double add if updating model", function () {
      server.respondWith("PUT", "api/tv_shows/1", [
        200, { "Content-Type": "application/json" }, "{}"
      ]);

      newView.saveTV(event);
      server.respond();

      expect(Clickster.searchResults.tvShows).to.have.length(4);
    });

    it("renders errors on failed save", function () {
      // server.restore();

      server.respondWith("POST", "/api/tv_shows", [
        422, { "Content-Type": "application/json" }, ""
      ]);

      appendToBody(newView.render().$el);
      newView.saveTV(event);
      server.respond();

      expect(newView).to.have.content("Status cannot be blank");
    });
  });
});

Array.prototype.last = function () {
  return this[this.length - 1];
};