Clickster.Views.TvIndexView = Backbone.View.extend({
  initialize: function () {
    this.subviews = [];
    this.listenTo(Clickster.currentUser, "sync", this.render);
    this.listenTo(Clickster.tvShows, "sync", this.render);
  },

  template: JST["tv_shows/index"],

  render: function () {
    if (Clickster.currentUser.get("is_admin")) {
      this.$el.html(this.template());
      this.renderCards();
    } else {
      this.$el.html("You do not have access to this page.");
    }

    return this;
  },

  renderCards: function () {
    Clickster.tvShows.admin().forEach(function (tv) {
      var tvView = new Clickster.Views.MiniCardView({ tv: tv });
      this.$(".tv-cards").append(tvView.render().$el);
      this.subviews.push(tvView);
    }.bind(this));
  },

  remove: function () {
    this.subviews.forEach(function (subview) {
      subview.remove();
    });

    Backbone.View.prototype.remove.call(this);
  }
});
