Qliqster.Views.WatchersView = Backbone.View.extend({
  initialize: function (options) {
    this.tv = options.tv;
    this.watchStatus = options.watchStatus;
    this.watchers = this.tv.watchers(this.watchStatus);
    this.headerVerb = Qliqster.STATUS_MESSAGES[this.watchStatus] || "likes";

    this.listenTo(this.watchers, "sync", this.render);
    this.listenTo(Qliqster.currentUser, "sync", this.renderHeader);
  },

  template: JST["tv_shows/watchers"],

  className: "watchers",

  render: function () {
    var content = this.template({
      watchers: this.watchers,
      headerVerb: this.headerVerb
    });

    this.$el.html(content);
    this.renderHeader();

    return this;
  },

  renderHeader: function () {
    if (this.watchers.length === 0 || !Qliqster.currentUser.signedIn()) {
      return;
    }

    this.buildHeader();
  },

  buildHeader: function () {
    var header = "";
    var idolCount = this.watchers.idolCount;
    var pluralizeNum = idolCount;

    if (this.watchers.first().isCurrentUser()) {
      header += "You ";

      if (idolCount) {
        pluralizeNum++;
        header += "and "
      }
    }

    if (idolCount) {
      header += idolCount + " of your idols ";
    }

    if (header) {
      header += Utils.pluralizeVerb(pluralizeNum, this.headerVerb) + " this.";
      this.$("h3").html(header);
    }
  }
});
