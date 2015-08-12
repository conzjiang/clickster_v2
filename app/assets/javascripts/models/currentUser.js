Clickster.Models.CurrentUser = Clickster.Models.User.extend({
  initialize: function () {
    this.feed = new Clickster.Collections.Feed();
  },

  url: 'api/current_user',

  signIn: function (options) {
    $.ajax(_.extend({
      url: "api/session",
      type: 'post',
      dataType: 'json'
    }, options));
  }
});
