Qliqster.Views.FacebookProfileView = Backbone.View.extend({
  initialize: function () {
    this.user = Qliqster.currentUser;
  },

  template: JST["users/fb_prof"],

  className: "forms",

  events: {
    "change #user_image": "uploadProfPic",
    "submit form": "saveUser"
  },

  uploadProfPic: function (e) {
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

  saveUser: function (e) {
    e.preventDefault();

    if (this.user.get('image')) {
      this.user.save({}, {
        success: this.navigateToRoot.bind(this)
      });
    } else {
      this.navigateToRoot();
    }
  },

  navigateToRoot: function () {
    Backbone.history.navigate("", { trigger: true });
  },

  render: function () {
    var content = this.template({ user: Qliqster.currentUser });
    this.$el.html(content);
    return this;
  }
});
