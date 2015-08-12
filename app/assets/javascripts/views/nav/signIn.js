Clickster.Views.SignInView = Backbone.View.extend({
  initialize: function (options) {
    this.newUser = false;
  },

  className: "content",

  template: JST['nav/signIn'],

  events: {
    'click .toggle': 'toggleForm',
    'submit form': 'signInUser'
  },

  toggleForm: function (event) {
    event.stopPropagation();
    this.newUser = !this.newUser;
    this.render();
  },

  signInUser: function () {
    event.preventDefault();
    var $form = $(event.target);
    var params = $form.serializeJSON();
    var that = this;

    $.ajax({
      url: $form.attr('action'),
      type: 'post',
      data: params,
      dataType: 'json',
      success: function (data) {
        if (data.newUser) Clickster.searchResults.users.push(data.username);
        window.location.reload();
      },
      error: function (data) {
        that.$('.errors').empty();

        _(data.responseJSON).each(function (error) {
          that.$('.errors').append('<li>' + error + '</li>');
        });

        that.$("input.first").select();
      }
    })
  },

  render: function () {
    var signedIn = !!Clickster.currentUser.id;
    var that = this;
    var $linkToSelect;

    var content = this.template({
      newUser: this.newUser,
      signedIn: signedIn
    });

    this.$el.html(content);
    this.$("input.first").focus();

    return this;
  }
});
