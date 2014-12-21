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
    console.log("upload")
    var that = this;

    e.preventDefault();

    filepicker.pick(Clickster.filepickerOptions, function (blob) {
      that.user.set("image_url", blob.url);
      that.$("img").attr("src", blob.url);
    });
  },

  updateProfile: function (e) {
    var params = $(e.target).serializeJSON().user;

    e.preventDefault();

    this.$(".error").removeClass("error");
    if (this._validatePassword(params)) return;

    this.user.save(params, {
      patch: true,
      success: function (data) {
        Backbone.history.navigate("users/" + data.username, { trigger: true });
      },
      error: function (model, data) {

      }
    })
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
    if (params.new_password && !params.password) {
      this._displayError({
        message: "Please enter your current password before changing your password.",
        fields: ["user_password"]
      });

      return true;
    }

    if (params.new_password !== params.confirm_password) {
      this._displayError({
        message: "Password confirmation does not match.",
        fields: ["user_new_password", "user_confirm_password"]
      });

      return true;
    }

    return false;
  },

  _displayError: function (options) {
    var that = this;
    this.$(".errors").html("<li>" + options.message + "</li>");

    _(options.fields).each(function (field) {
      that.$("#" + field).parent().addClass("error");
    });
  }
});