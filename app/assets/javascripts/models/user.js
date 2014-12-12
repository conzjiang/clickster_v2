Clickster.Models.User = Backbone.Model.extend({
  initialize: function (options) {
    this.set("username", options.username);
  },

  url: function () {
    return '/api/users/' + this.get("username");
  }
});