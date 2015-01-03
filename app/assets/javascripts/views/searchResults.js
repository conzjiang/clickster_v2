Clickster.Views.SearchResultsView = Backbone.View.extend({
  initialize: function (options) {
    if (options.params && !options.model) {
      this.model = Clickster.searchResults.getOrFetch(options.params);
    }

    this.listenTo(this.model, "change", this.render);
  },

  template: JST["searches/results"],
  tvResultTemplate: JST["searches/tv"],
  userResultTemplate: JST["searches/user"],

  render: function () {
    var content = this.template({
      results: this.model.get("results") || [],
      tvResult: this.tvResultTemplate,
      userResult: this.userResultTemplate
    });

    this.$el.html(content);
    this.dotdotdot();

    return this;
  }
});
