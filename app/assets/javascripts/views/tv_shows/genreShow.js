Clickster.Views.GenreShowView = Backbone.View.extend({
  initialize: function (options) {
    this.genre = Utils.dehyphenate(options.genre);
    this.listenTo(Clickster.tvShows, "add", this.render);
  },

  template: JST["tv_shows/genreShow"],

  render: function () {
    var content = this.template({
      genre: this.genre,
      shows: Clickster.tvShows.byGenre(this.genre),
      tvCard: JST["tv_shows/miniCard"]
    });

    this.$el.html(content);
    return this;
  }
})