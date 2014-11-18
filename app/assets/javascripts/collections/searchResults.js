Clickster.Collections.SearchResults = Backbone.Collection.extend({
  model: Clickster.Models.SearchResult,

  url: 'api/search',

  getOrFetch: function (params) {
    var result = this.findWhere({ params: params });
    var that = this;

    if (!result) {
      result = new this.model({ params: params });

      $.ajax({
        type: 'get',
        url: this.url,
        data: params,
        dataType: 'json',
        success: function (data) {
          result.set('results', data);
          that.add(result);
        }
      });
    }

    return result;
  }
});
