Clickster.Collections.Users = Backbone.Collection.extend({
  model: Clickster.Models.User,

  getOrFetch: function (username) {
    var user = this.findWhere({ username: username });

    if (!user) {
      var that = this;
      user = new Clickster.Models.User({ username: username });

      user.fetch({
        success: function () {
          that.add(user);
        },
        error: function () {
          that.add(user);
          user.notFound = true;
          user.trigger("notFound");
        }
      });
    }

    return user;
  }
});