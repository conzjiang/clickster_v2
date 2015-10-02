Qliqster.Views.UserEditView = Backbone.View.extend({
  initialize: function () {
    this.user = Qliqster.currentUser;
    this.listenTo(this.user, "sync", this.render);
  },

  className: "forms user-edit",

  template: JST["users/edit"],

  events: {
    "change #user_profile_pic": "uploadPic",
    "submit form": "updateProfile"
  },

  uploadPic: function (e) {
    var file = e.currentTarget.files[0];
    var reader = new FileReader();

    reader.onloadend = function () {
      this.user.set("image", reader.result);
      this.$("img").attr("src", reader.result);
      Utils.adjustImage(reader.result, this.$("img"));
    }.bind(this);

    if (file) {
      reader.readAsDataURL(file);
    } else {
      this.$("img").attr("src", "");
    }
  },

  updateProfile: function (e) {
    var params = $(e.currentTarget).serializeJSON().user;
    var that = this;

    e.preventDefault();
    if (params && !this._validatePassword(params)) return;

    this.user.save(params, {
      success: function () {
        Backbone.history.navigate("users/" + that.user.get("username"), {
          trigger: true
        });
      },
      error: function (model, data) {
        that.$(":input").prop("disabled", false);
        that._displayErrors(data.responseJSON);
      }
    });

    this.$(":input").prop("disabled", true);
  },

  render: function () {
    var content = this.template({ user: this.user });

    if (this.user.signedIn()) {
      this.$el.html(content);
    } else {
      this.$el.html("You must be signed in to perform this action!");
    }

    return this;
  },

  _validatePassword: function (params) {
    var errors;

    if (params.new_password && !params.password) {
      errors = {
        password: ["must be provided before changing password."]
      };
    } else if (params.new_password !== params.password_confirmation) {
      errors = {
        password_confirmation: ["does not match."]
      };
    }

    if (errors) {
      this._displayErrors(errors);
      return false;
    }

    return true;
  },

  _displayErrors: function (errors) {
    this.$(".error").removeClass("error");

    Utils.renderErrors({
      view: this,
      errors: errors,
      fieldPrepend: "#user_"
    });
  }
});
