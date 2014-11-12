Clickster.Views.Sidebar = Backbone.View.extend({
  initialize: function () {
  },

  template: JST['sidebar'],

  events: {
    'click input[name=query]': 'expandInput',
    'blur input[name=query]': 'revertInput'
  },

  expandInput: function () {
    $(event.target).addClass('open');
  },

  revertInput: function () {
    $(event.target).removeClass('open');
  },

  render: function () {
    this.$el.html(this.template());
    return this;
  }
});
