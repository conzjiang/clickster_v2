Clickster.Views.GenreShowView = Backbone.View.extend({
  initialize: function (options) {
    this.genre = Utils.dehyphenate(options.genre);
    this.listenTo(Clickster.tvShows, "add", this.render);
  },

  template: JST["tv_shows/genreShow"],

  render: function () {
    var content, shows;

    content = this.template({ genre: this.genre });
    this.$el.html(content);

    shows = Clickster.tvShows.byGenre(this.genre);
    this.setMiniCards(shows);

    return this;
  }
})