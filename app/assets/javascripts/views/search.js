Clickster.Views.Search = Backbone.View.extend({
  initialize: function (options) {
    this.params = options.params;

    if (this.params) {
      this.model = Clickster.searchResults.getOrFetch(this.params);
    }

    this.listenTo(this.model, "change", this.render);
  },

  template: JST["searches/results"],
  tvResultTemplate: JST["searches/tv"],
  userResultTemplate: JST["searches/user"],

  render: function () {
    var content = this.template({
      results: this.model.get("results") || [],
      tvResult: this.tvResultTemplate.bind(this),
      userResult: this.userResultTemplate.bind(this)
    });

    this.$el.html(content);
    this.$(".content").dotdotdot();

    return this;
  }
});
