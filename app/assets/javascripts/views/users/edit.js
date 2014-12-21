Clickster.Views.UserEditView = Backbone.View.extend({
  initialize: function () {
    this.user = Clickster.currentUser;
    this.listenTo(this.user, "sync", this.render);
  },

  className: "forms user-edit",

  template: JST["users/edit"],

  events: {
    "click .filepicker-upload": "uploadPic",
    "submit form": "updateProfile"
  },

  uploadPic: function (e) {
    var that = this;

    e.preventDefault();

    filepicker.pick(Clickster.filepickerOptions, function (blob) {
      that.user.set("image_url", blob.url);
      that.$("img").attr("src", blob.url);
    });
  },

  updateProfile: function (e) {
    var params = $(e.target).serializeJSON().user;
    var passwordFields = ["password", "new_password", "password_confirmation"];
    var that = this;

    e.preventDefault();
    if (!this._validatePassword(params)) return;

    this.user.save(params, {
      success: function (data) {
        var username = that.user.get("username");

        _(passwordFields).each(function (field) {
          that.user.unset(field);
        });

        Backbone.history.navigate("users/" + username, { trigger: true });
      },
      error: function (model, data) {
        that._displayErrors(data.responseJSON);
      }
    });
  },

  render: function () {
    var signedIn = !!this.user.id;
    var content = this.template({ user: this.user });

    if (!signedIn) {
      this.$el.html("You must be signed in to perform this action!");
      return this;
    }

    this.$el.html(content);
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