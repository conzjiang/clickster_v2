Backbone.TvCardsView = Backbone.View.extend({
  subviews: function () {
    this._subviews = this._subviews || [];
    return this._subviews;
  },

  renderCards: function () {
    this.collection.each(function (tv) {
      var tvView = new Clickster.Views.TvCardView({ tv: tv });
      this.$("ul.tv-results").append(tvView.render().$el);
      this.subviews().push(tvView);
    }.bind(this));

    this.ellipsis();
  },

  removeSubviews: function () {
    this.subviews().forEach(function (view) {
      view.remove();
    });
  },

  remove: function () {
    this.removeSubviews();
    Backbone.View.prototype.remove.call(this);
  }
});
