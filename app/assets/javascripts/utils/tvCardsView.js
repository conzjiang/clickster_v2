Backbone.TvCardsView = Backbone.View.extend({
  subviews: function () {
    this._subviews = this._subviews || [];
    return this._subviews;
  },

  renderCards: function (tvs) {
    tvs.forEach(function (tv) {
      this.addSubview({
        $container: this.$("ul.tv-results"),
        view: new Clickster.Views.TvCardView({ tv: tv })
      });
    }.bind(this));

    this.ellipsis();
  },

  addSubview: function (options) {
    options.$container.append(options.view.render().$el);
    this.subviews().push(options.view);
  },

  removeSubviews: function () {
    this.subviews().forEach(function (view) {
      view.remove();
    });
  },

  remove: function () {
    this.removeSubviews();
    return Backbone.View.prototype.remove.call(this);
  }
});
