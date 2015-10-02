//= require spec_helper

describe("TV new view", function () {
  var NewTvView;

  beforeEach(function () {
    NewTvView = Qliqster.Views.NewTvView;
    Qliqster.currentUser = new Backbone.Model({ is_admin: true });
  });

  it("initializes with an empty TV model when not given one", function () {
    var view = new NewTvView({});
    expect(view.tv).to.be.an.instanceof(Qliqster.Models.TvShow);
  });

  it("initializes with the given TV model otherwise", function () {
    var view = new NewTvView({ tv: new Backbone.Model() });
    expect(view.tv).to.be.an.instanceof(Backbone.Model);
  });

  describe("#render", function () {
    it("renders the new template if action is new", function () {
      var view = new NewTvView({ action: "new" }).render();
      expect(view).to.have.content("Add a Series");
    });

    it("renders the edit template if action is edit", function () {
      var view = new NewTvView({ action: "edit" }).render();
      expect(view).to.have.content("Edit");
    });

    it("renders the form view", function () {
      var view = new NewTvView({ action: "new" }).render();
      expect(view).to.have.content("Add Manually");
    });

    it("doesn't render template when current user isn't admin", function () {
      var view = new NewTvView({ action: "new" });
      Qliqster.currentUser.set("is_admin", false);
      expect(view.render()).to.have.content("You are not allowed");
    });
  });

  describe("#autocomplete", function () {
    var event, view, fillOutForm;

    beforeEach(function () {
      setUpResultsDom();
      event = { preventDefault: function(){}, target: ".new-imdb-tv" };
      Qliqster.searchResults = new Qliqster.Collections.SearchResults();
      Qliqster.GENRES = ["Comedy", "Romance"];

      view = new NewTvView({ action: "new" });

      fillOutForm = function (title) {
        view.render().$("input[name=title]").val(title);
        appendToBody(view.$el);
        view.autocomplete(event);
      };
    });

    afterEach(function () {
      $.ajax.restore();
    });

    describe("on success", function () {
      beforeEach(function () {
        sinon.stub($, "ajax").yieldsTo("success", {
          Year: "2014",
          Genre: "Comedy, Romance",
          Title: "Selfie"
        });
      });

      it("sets attributes from response onto TV model", function () {
        fillOutForm("selfie");

        expect(view.tv.get("title")).to.equal("Selfie");
      });

      it("doesn't make request if title already exists", function () {
        fillOutForm("orphan black");

        expect(view).to.have.content("Series already exists");
        expect($.ajax.called).to.be.false;
      });
    });

    it("displays no results on error", function () {
      sinon.stub($, "ajax").yieldsTo("error", {});
      fillOutForm("jkljlkj");

      expect(view).to.have.content("No results!");
    });

    it("doesn't double set attributes if redoing search", function () {
      sinon.stub($, "ajax").yieldsTo("success", {
        Year: "2014",
        Genre: "Comedy, Romance",
        Title: "Selfie",
        Plot: "My Fair Lady"
      });
      fillOutForm("selfie");
      $.ajax.restore();

      sinon.stub($, "ajax").yieldsTo("success", {
        Year: "2014",
        Genre: "Comedy",
        Title: "blackish"
      });
      fillOutForm("blackish");

      expect(view.tv.get("title")).to.equal("blackish");
      expect(view.tv.get("blurb")).to.be.undefined;
    });
  });
});