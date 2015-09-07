Clickster.Views.WatchersView = Backbone.View.extend({
  initialize: function (options) {
    this.tv = options.tv;
    this.watchStatus = options.watchStatus;
    this.watchers = this.tv.watchers(this.watchStatus);
    this.headerVerb = Clickster.STATUS_MESSAGES[this.watchStatus] || "likes";

    this.listenTo(this.watchers, "sync", this.render);
  },

  template: JST["tv_shows/watchers"],

  className: "watchers",

  render: function () {
    var content = this.template({
      watchers: this.watchers
    });

    this.$el.html(content);
    this.renderHeader();

    return this;
  },

  renderHeader: function () {
    if (this.watchers.length === 0) {
      this.$("h3").html("No one " + this.headerVerb + " this.");
    } else if (Clickster.currentUser.signedIn()) {
      this.buildHeader();
    }
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
