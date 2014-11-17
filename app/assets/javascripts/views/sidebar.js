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
    var query = $(event.target).serializeJSON();
    var queryString = $(event.target).serialize();

    $.ajax({
      type: 'get',
      url: '/api/search',
      data: query,
      dataType: 'json',
      success: function (data) {
        var result = new Clickster.Models.SearchResult({
          results: data,
          params: queryString
        });

        Clickster.searchResults.add(result);
        Backbone.history.navigate('search?' + queryString, { trigger: true });
      }
    });
  },

  render: function () {
    this.$el.html(this.template());
    return this;
  }
});
