Clickster.Views.Sidebar = Backbone.View.extend({
  initialize: function () {
    Clickster.searchResults = new Clickster.Collections.SearchResults();
  },

  template: JST['sidebar'],

  events: {
    'click input[name=query]': 'expandInput',
    'blur input[name=query]': 'revertInput',
    'submit form.search': 'textSearch',
    'submit form.discover': 'runQuery'
  },

  expandInput: function (event) {
    $(event.target).addClass('open');
    $(event.target).val("");
  },

  revertInput: function (event) {
    $(event.target).removeClass('open');
  },

  textSearch: function (event) {
    event.preventDefault();
    var searchTerm = this.$('input').val();
    Backbone.history.navigate('search?text=' + searchTerm, {
      trigger: true
    });
  },

  runQuery: function (event) {
    event.preventDefault();
    var params = $(event.target).serialize();
    Backbone.history.navigate('search?' + params, { trigger: true });
  },

  render: function () {
    this.$el.html(this.template());
    return this;
  }
});
