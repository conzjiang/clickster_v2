Clickster.Views.FollowerInfoView = Backbone.View.extend({
  initialize: function (options) {
    this.tv = options.tv;
    this.status = this.tv.escape("watch_status") || "Watching";

    this.listenTo(Clickster.currentUser, "sync", this.render);
  },

  template: JST["tv_shows/followerInfo"],

  render: function () {
    var content = this.template({
      watchers: this.tv.watchers(this.status),
      status: Clickster.STATUS_MESSAGES[this.status]
    });

    this.$el.html(content);

    return this;
  }
});
