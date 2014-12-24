Clickster.Views.Home = Backbone.View.extend({
  initialize: function () {
    this.listenTo(Clickster.tvShows, "sync", this.render);
  },

  template: JST['home'],

  render: function () {
    var content = this.template({
      shows: Clickster.tvShows.current(),
      tvCard: JST["searches/tv"]
    });

    this.$el.html(content);
    this.$(".content").dotdotdot();

    return this;
  }
});
