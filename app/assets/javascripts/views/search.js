Clickster.Views.Search = Backbone.View.extend({
  initialize: function (options) {
    this.params = options.params;
    this.model = options.model ||
      Clickster.searchResults.getOrFetch(this.params);

    this.listenTo(this.model, 'change', this.render);
  },

  template: JST['search'],

  render: function () {
    var content = this.template({ results: this.model.get('results') });
    this.$el.html(content);
    return this;
  }
});
