Clickster.Collections.Users = Backbone.Collection.extend({
  model: Clickster.Models.User,

  getOrFetch: function (username) {
    var user = this.findWhere({ username: username });

    if (!user) {
      var that = this;
      user = new Clickster.Models.User({ username: username });
      this.add(user);

      user.fetch({
        error: function () {
          user.notFound = true;
          user.trigger("notFound");
        }
      });
    }

    return user;
  }
});