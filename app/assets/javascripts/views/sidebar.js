Clickster.Views.Sidebar = Backbone.View.extend({
  initialize: function () {
    Clickster.searchResults = new Clickster.Collections.SearchResults();
  },

  template: JST['sidebar'],

  events: {
    'click input[name=query]': 'expandInput',
    'blur input[name=query]': 'revertInput',
    'submit form.search': 'liveSearch',
    'submit form.discover': 'runQuery'
  },

  expandInput: function (event) {
    $(event.target).addClass('open');
  },

  revertInput: function (event) {
    $(event.target).removeClass('open');
  },

  runQuery: function (event) {
    event.preventDefault();
    var params = $(event.target).serialize();
    var prevSearch = Clickster.searchResults.findWhere({ params: params });

    if (prevSearch) {
      Backbone.history.navigate('search?' + params, { trigger: true });
    } else {
      $.ajax({
        type: 'get',
        url: '/api/search',
        data: params,
        dataType: 'json',
        success: function (data) {
          var result = new Clickster.Models.SearchResult({
            results: data,
            params: params
          });

          Clickster.searchResults.add(result);
          Backbone.history.navigate('search?' + params, { trigger: true });
        }
      });
    }
  },

  render: function () {
    this.$el.html(this.template());
    return this;
  }
});
