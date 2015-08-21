Clickster.Views.FacebookProfileView = Backbone.View.extend({
  initialize: function () {
    this.listenTo(Clickster.currentUser, "sync", this.render);
  },

  template: JST["users/fb_prof"],

  className: "forms",

  events: {
    "keypress #user_username": "checkUsernameLength",
    "keyup #user_username": "maybeRemoveWarning",
    "blur #user_username": "validateUsername",
    "click .filepicker-upload": "uploadProfPic"
  },

  checkUsernameLength: function (e) {
    var maxLength = Clickster.MAX_USERNAME_LENGTH;

    if ($(e.currentTarget).val().length > maxLength) {
      e.preventDefault();
      this.usernameWarning("Maximum " + maxLength + " characters");
    }
  },

  usernameWarning: function (message) {
    var $input = this.$("#user_username");
    $input.addClass("warning");
    $input.next().addClass("warning").html(message);
  },

  maybeRemoveWarning: function (e) {
    var $input = $(e.currentTarget);

    $input.removeClass("success");
    $input.next().removeClass("success").html(".");

    if ($(e.currentTarget).val().length <= Clickster.MAX_USERNAME_LENGTH) {
      this.removeUsernameWarning();
    }
  },

  removeUsernameWarning: function () {
    this.$(".warning").removeClass("warning");
    this.$("#user_username").next().html(".");
  },

  validateUsername: function (e) {
    var $input = $(e.currentTarget);

    $.ajax({
      method: "get",
      url: "/api/username",
      data: { username: $input.val() },
      dataType: "json",
      success: function () {
        $input.addClass("success");
        $input.next().
          addClass("success").
          html("Nice to meet you, " + $input.val() + "!");
      },
      error: function () {
        this.usernameWarning("Username has already been taken!");
      }.bind(this)
    });
  },

  uploadProfPic: function (e) {
    e.preventDefault();

    filepicker.pick(Clickster.filepickerOptions, function (blob) {
      Clickster.currentUser.set("image_url", blob.url);
      this.$("#user_image_url").attr("src", blob.url);
    }.bind(this));
  },

  render: function () {
    var content = this.template({ user: Clickster.currentUser });
    this.$el.html(content);
    return this;
  }
})