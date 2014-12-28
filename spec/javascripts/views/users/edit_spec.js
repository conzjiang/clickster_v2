//= require spec_helper

describe("User edit view", function () {
  var view;

  beforeEach(function () {
    Clickster.currentUser = new Clickster.Models.CurrentUser({
      id: 1,
      username: "conz"
    });

    view = new Clickster.Views.UserEditView();
  });

  describe("#uploadPic", function () {
    var event;

    beforeEach(function () {
      event = { preventDefault: function(){} };
      filepicker = { pick: function(){} };
      Clickster.filepickerOptions = {};
      sinon.stub(filepicker, "pick").yields({ url: "pic.jpg" });
    });

    it("sets the user's image url", function () {
      view.uploadPic(event);
      expect(Clickster.currentUser.get("image_url")).to.equal("pic.jpg");
    });

    it("injects the image into the DOM", function () {
      view.render();
      view.uploadPic(event);
      expect(view.$("img").attr("src")).to.equal("pic.jpg");
    });
  });

  describe("#updateProfile", function () {
    var server, event;

    before(function () {
      server = sinon.fakeServer.create();
      event = { preventDefault: function(){}, target: "form" };
    });

    after(function () {
      server.restore();
    });

    beforeEach(function () {
      $("body").html(view.render().$el);
    });

    it("updates user's attributes", function () {
      server.respondWith([
        200, { "Content-Type": "application/json" }, JSON.stringify({
          email: "conz@example.com"
        })
      ]);

      view.updateProfile(event);
      server.respond();

      expect(Clickster.currentUser.get("email")).to.equal("conz@example.com");
    });

    it("doesn't save attributes if fails password validation", function () {
      server.respondWith([
        200, { "Content-Type": "application/json" }, JSON.stringify({
          email: "conz@example.com"
        })
      ]);

      view.$("#user_new_password").val("password");
      view.updateProfile(event);
      server.respond();

      expect(Clickster.currentUser.get("email")).to.be.undefined;
    });

    it("doesn't set password attributes on user", function () {
      server.respondWith([
        200, { "Content-Type": "application/json" }, JSON.stringify({
          email: "conz@example.com"
        })
      ]);

      view.$("#user_password").val("password");
      view.updateProfile(event);
      server.respond();

      expect(Clickster.currentUser.get("password")).to.be.undefined;
    });

    it("displays errors when save fails", function () {
      server.respondWith([
        422, { "Content-Type": "application/json" }, JSON.stringify({
          password: ["is incorrect"]
        })
      ]);
      view.$("#user_password").val("aaa");
      view.updateProfile(event);
      server.respond();

      expect(view).to.have.content("Password is incorrect");
    });
  });

  describe("#render", function () {
    it("renders the user edit template", function () {
      view.render();
      expect(view).to.have.content("Edit Profile");
    });

    it("doesn't render template when no one is signed in", function () {
      Clickster.currentUser = new Backbone.Model();
      view = new Clickster.Views.UserEditView().render();

      expect(view).to.have.content("You must be signed in");
      expect(view).not.to.have.content("Edit Profile");
    });
  });

  describe("#_validatePassword", function () {
    it("returns true if password params are valid", function () {
      var validation = view._validatePassword({
        password: "password",
        new_password: "new_password",
        password_confirmation: "new_password"
      });

      expect(validation).to.be.ok;
    });

    it("returns false if password not given but new password is", function () {
      var validation = view._validatePassword({
        new_password: "new_password"
      });

      expect(validation).not.to.be.ok;
    });

    it("returns false if password doesn't match confirmation", function () {
      var validation = view._validatePassword({
        password: "password",
        new_password: "new_password",
        password_confirmation: "jkladkfkj"
      });

      expect(validation).not.to.be.ok;
    });

    it("returns true if no password params are provided", function () {
      expect(view._validatePassword({})).to.be.ok;
    });
  });

  describe("#_displayErrors / Utils.renderErrors", function () {
    it("renders full message errors onto the page", function () {
      view.render();
      view._displayErrors({ password: ["is too short"] });

      expect(view).to.have.content("Password is too short");
    });
  });
});