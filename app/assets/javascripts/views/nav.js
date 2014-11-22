Clickster.Views.Nav = Backbone.View.extend({
  initialize: function () {
    this.searchView = this.searchView || new Clickster.Views.SearchFormView();

    this.listenTo(Clickster.currentUser, 'sync', this.render);
  },

  template: JST['nav'],

  events: {
    'click #open-search': 'openSearch'
  },

  openSearch: function () {
    this.$(".search-form").toggleClass("show");
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
    this.$(".search-form").html(this.searchView.render().$el);
    
    return this;
  },

  remove: function () {
    if (this.searchView) this.searchView.remove();
    return Backbone.View.prototype.remove.apply(this);
  }
});
