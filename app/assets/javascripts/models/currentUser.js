Clickster.Models.CurrentUser = Clickster.Models.User.extend({
  initialize: function () {
    this.feed = new Clickster.Collections.Feed();
  },

  url: 'api/current_user',

  signIn: function (options) {
    var success;
    if (options) {
      success = options.success;
      delete options.success;
    }

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
    this.signIn(_.extend({
      url: "api/session/demo"
    }, options));
  },

  passwordFields: ["password", "new_password", "password_confirmation"],

  save: function (attrs, options) {
    var success = Utils.success(options);

    return Clickster.Models.User.prototype.save.call(this, attrs, _.extend({
      method: "put",
      success: function (model, data) {
        _(this.passwordFields).each(this.unset.bind(this));
        success && success(model, data);
      }.bind(this)
    }, options));
  },

  signedIn: function () {
    return !!this.get("username");
  },

  toJSON: function () {
    return { current_user: _.clone(this.attributes) };
  }
});
