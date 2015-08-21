Clickster.Models.CurrentUser = Clickster.Models.User.extend({
  initialize: function () {
    this.feed = new Clickster.Collections.Feed();
  },

  url: 'api/current_user',

  signIn: function (options) {
    var success = options.success;
    delete options.success;

    $.ajax(_.extend({
      url: "api/session",
      type: 'post',
      dataType: 'json',
      success: function (data) {
        this.set(data);
        this.trigger("sync");
        success && success(data);
      }.bind(this)
    }, options));
  },

  demoSignIn: function (options) {
    var success = options.success;
    delete options.success;

    this.signIn(_.extend({
      url: "api/session/demo",
      success: function (data) {
        this.isDemoUser = true;
        success && success(data);
      }.bind(this)
    }, options));
  },

  toJSON: function () {
    return { current_user: _.clone(this.attributes) };
  }
});
