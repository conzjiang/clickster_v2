Clickster.Views.FacebookProfileView = Backbone.View.extend({
  initialize: function () {
    this.listenTo(Clickster.currentUser, "sync", this.render);
  },

  template: JST["users/fb_prof"],

  className: "forms",

  events: {
    "keypress #user_username": "checkUsernameLength",
    "keyup #user_username": "removeUsernameWarning",
    "click .filepicker-upload": "uploadProfPic"
  },

  checkUsernameLength: function (e) {
    var $input = $(e.currentTarget);
    var maxLength = Clickster.MAX_USERNAME_LENGTH;

    if ($input.val().length > maxLength) {
      e.preventDefault();
      $input.addClass("warning");
      $input.next().
        addClass("warning").
        html("Maximum " + maxLength + " characters");
    }
  },

  removeUsernameWarning: function (e) {
    var $input = $(e.currentTarget);
    if ($input.val().length <= Clickster.MAX_USERNAME_LENGTH) {
      this.$(".warning").removeClass("warning");
      $input.next().html(".");
    }
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