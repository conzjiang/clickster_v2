Qliqster.Views.DropdownView = Backbone.View.extend({
  template: JST["nav/dropdownMenu"],

  className: "content",

  events: {
    "touchstart .nav-link": "mobileTouch",
    "touchmove .nav-link": "mobileTouch"
  },

  mobileTouch: function (event) {
    $(event.target).toggleClass("touch");
    $(event.target).closest("li").toggleClass("touch");
  },

  render: function () {
    var isAdmin = Qliqster.currentUser.get("is_admin");
    var content = this.template({
      isAdmin: isAdmin
    });

    this.$el.html(content);
    $.rails.refreshCSRFTokens();

    if (isAdmin) this.$(".dropdown").addClass("admin");

    return this;
  }
});
