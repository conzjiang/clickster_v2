Clickster.Models.SearchResult = Backbone.Model.extend({
  initialize: function (options) {
    this.results = options.results;
    this.params = options.params;
  },

  sortBy: function (comparator) {
    _(this.results).sortBy(comparator);
  }
})
