Qliqster.Views.GenreShowView = Backbone.MiniCardsView.extend({
  initialize: function (options) {
    this.genre = options.genre;
    this.listenTo(this.collection, "sync", this.render);
  },

  template: JST["tv_shows/genreShow"],

  render: function () {
    var content = this.template({ genre: this.genre });
    this.$el.html(content);
    this.renderMiniCards();
    return this;
  }
});
