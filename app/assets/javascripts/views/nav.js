Clickster.Views.Nav = Backbone.View.extend({
  initialize: function () {
    this.listenTo(Clickster.currentUser, 'sync', this.render);
  },

  template: JST['nav'],

  events: {
    'click figure': 'toggleMenu'
  },

  toggleMenu: function (e) {
    var that = this;
    $(event.target).toggleClass('open');

    $('body').on('click', function () {
      var outsideNav = !$(event.target).closest('.links').length;
      var clickedNavLink = !!$(event.target).closest('.dropdown').length;

      if (outsideNav || clickedNavLink) {
        that.closeMenu();
        $(this).off('click');
      }
    });
  },

  closeMenu: function () {
    this.$('figure').removeClass('open');
  },

  render: function () {
    var signedIn = !!Clickster.currentUser.id;

    var content = this.template({
      signedIn: signedIn
    });

    this.$el.html(content);
    return this;
  }
});
