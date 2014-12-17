Clickster.Views.UserEditView = Backbone.View.extend({
  initialize: function () {
    this.user = Clickster.currentUser;

    this.listenTo(this.user, "sync", this.render);
  },

  className: "forms user-edit",

  template: JST["users/edit"],

  render: function () {
    var signedIn = !!this.user.id;
    var content = this.template({ user: this.user });

    if (!signedIn) {
      this.$el.html("You must be signed in to perform this action!");
      return this;
    }

    this.$el.html(content);
    return this;
  }
});