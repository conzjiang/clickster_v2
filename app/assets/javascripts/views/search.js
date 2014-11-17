Clickster.Views.Search = Backbone.View.extend({
  initialize: function (options) {
    this.params = options.params;
    this.model = options.model ||
      Clickster.searchResults.findWhere({ params: this.params });
  },

  template: JST['search'],

  render: function () {
    if (this.model) {
      var content = this.template({ results: this.model.results });
      this.$el.html(content);
    }
    
    return this;
  }
});
