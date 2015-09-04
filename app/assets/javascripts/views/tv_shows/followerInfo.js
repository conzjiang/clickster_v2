Clickster.Views.FollowerInfoView = Backbone.View.extend({
  initialize: function (options) {
    this.tv = options.tv;
    this.watchStatus = options.watchStatus;
    this.watchers = this.tv.watchers(this.watchStatus);
    this.headerVerb = Clickster.STATUS_MESSAGES[this.watchStatus];

    this.listenTo(this.watchers, "sync", this.render);
  },

  template: JST["tv_shows/followerInfo"],

  render: function () {
    var content = this.template({
      watchers: this.watchers
    });

    this.$el.html(content);
    this.buildHeader();

    return this;
  },

  buildHeader: function () {
    if (this.watchers.length === 0 || !Clickster.currentUser.signedIn()) return;
    var header = "";
    var idolCount = this.watchers.watching_idols_count;

    if (this.watchers.first().isCurrentUser()) {
      header += "You ";
      idolCount--;
    }

    if (idolCount) {
      header += " and " + idolCount + " of your idols ";
    }

    if (header) {
      header += Utils.pluralizeVerb(idolCount, this.headerVerb) + " this.";
      this.$("h3").html(header);
    }
  }
});
