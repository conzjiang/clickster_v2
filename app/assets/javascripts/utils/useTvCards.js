Backbone.View.prototype.useTvCards = function () {
  var remove = this.remove.bind(this);

  this.subviews = [];

  _.extend(this, {
    renderCards: function (tvs) {
      var that = this;

      tvs.forEach(function (tv) {
        var tvCardView = new Clickster.Views.TvCardView({ tv: tv });
        that.addSubview({
          $container: that.$("ul.tv-results"),
          view: tvCardView
        });
      });

      this.ellipsis();
    },

    addSubview: function (options) {
      options.$container.append(options.view.render().$el);
      this.subviews.push(options.view);
    },

    removeSubviews: function () {
      this.subviews.forEach(function (view) {
        view.remove();
      });
    },

    remove: function () {
      this.removeSubviews();
      remove();
    }
  });
};