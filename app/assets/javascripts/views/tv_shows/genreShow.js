Clickster.Views.GenreShowView = Backbone.MiniCardsView.extend({
  initialize: function (options) {
    this.genre = Utils.dehyphenate(options.genre);
    this.listenTo(Clickster.tvShows, "add", this.render);
  },

  template: JST["tv_shows/genreShow"],

  render: function () {
    var content = this.template({ genre: this.genre });
    this.$el.html(content);
    this.renderMiniCards();
    return this;
  },

  tvShows: function () {
    return Clickster.tvShows.byGenre(this.genre);
  }
});
