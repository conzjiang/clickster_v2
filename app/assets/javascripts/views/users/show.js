Clickster.Views.UserShowView = Backbone.View.extend({
  initialize: function (options) {
    this.user = options.user;
    this.listenTo(this.user, "sync", this.render);
    this.listenTo(this.user, "notFound", this.error);
  },

  template: JST["users/show"],

  error: function () {
    this.$el.html("User not found");
  },

  render: function () {
    var content = this.template({ user: this.user });

    if (this.user.notFound) {
      this.error();
    } else {
      this.$el.html(content);
    }

    return this;
  }
});