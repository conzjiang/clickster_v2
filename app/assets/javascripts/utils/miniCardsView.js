Backbone.MiniCardsView = Backbone.View.extend({
  subviews: function () {
    this._subviews = this._subviews || [];
    return this._subviews;
  },

  renderMiniCards: function () {
    this.tvShows().forEach(function (tv) {
      var tvView = new Clickster.Views.MiniCardView({ tv: tv });
      this.$(".tv-cards").append(tvView.render().$el);
      this.subviews().push(tvView);
    }.bind(this));
  },

  remove: function () {
    this.subviews().forEach(function (subview) {
      subview.remove();
    });

    Backbone.View.prototype.remove.call(this);
  }
});