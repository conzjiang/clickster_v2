Clickster.Views.Sidebar = Backbone.View.extend({
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
  },

  render: function () {
    this.$el.html(this.template());
    return this;
  }
});
