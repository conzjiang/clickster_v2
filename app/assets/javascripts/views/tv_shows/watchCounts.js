Qliqster.Views.WatchCountsView = Backbone.View.extend({
  initialize: function (options) {
    this.tv = options.tv;
    this.watchStatus = options.watchStatus;

    this.listenTo(this.tv, "watchCounts", this.render);
    Qliqster.eventManager.onResize(this.render, this);
  },

  tagName: "article",
  className: "watchers-container",

  template: JST["tv_shows/watchCounts"],

  events: {
    "change :input": "displayWatchers"
  },

  displayWatchers: function (e) {
    this.watchStatus = $(e.currentTarget).val();
    this.renderWatchers();
  },

  render: function () {
    var content = this.template({
      tv: this.tv,
      onMobile: $(window).width() < 500
    });

    this.$el.html(content);
    this.$("#" + Utils.hyphenate(this.watchStatus)).prop("checked", true);
    this.renderWatchers();

    return this;
  },

  renderWatchers: function () {
    this.watchersView && this.watchersView.remove();

    this.watchersView = new Qliqster.Views.WatchersView({
      tv: this.tv,
      watchStatus: this.watchStatus
    });

    this.$el.append(this.watchersView.$el);
    this.watchersView.render();
  },

  remove: function () {
    this.watchersView && this.watchersView.remove();
    Qliqster.eventManager.offResize(this);
    Backbone.View.prototype.remove.call(this);
  }
});
