Clickster.Views.DropdownView = Backbone.View.extend({
  className: "content",

  template: JST["dropdownMenu"],

  render: function () {
    var isAdmin = Clickster.currentUser.get("is_admin");
    var content = this.template({ isAdmin: isAdmin });

    this.$el.html(content);
    if (isAdmin) this.$(".dropdown").addClass("admin");
    return this;
  }
});
