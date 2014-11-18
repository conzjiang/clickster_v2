Clickster.Models.SearchResult = Backbone.Model.extend({
  sortBy: function (comparator) {
    _(this.get('results')).sortBy(comparator);
  }
})
