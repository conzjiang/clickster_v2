Clickster.Collections.Watchers = Clickster.Collections.Users.extend({
  initialize: function (models, options) {
    this.tv = options.tv;
    this.watchStatus = options.watchStatus;
  },

  url: function () {
    return 'api/tv_shows/' + this.tv.id + '/watchers';
  },

  fetch: function (options) {
    return Backbone.Collection.prototype.fetch.call(this, _.extend({
      data: { status: this.watchStatus }
    }, options));
  },

  parse: function (response) {
    this.idolCount = response.watching_idols_count;
    return response.watchers;
  }
});
