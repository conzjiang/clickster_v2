Clickster.Views.SignInView = Backbone.View.extend({
  initialize: function (options) {
    this.newUser = false;
  },

  className: "content",

  template: JST['nav/signIn'],

  events: {
    'click a': 'toggleForm',
    'submit form': 'signInUser'
  },

  toggleForm: function (event) {
    var $link = $(event.target);
    event.stopPropagation();

    if (!$link.hasClass('selected')) {
      this.newUser = !this.newUser;
      this.render();
    }
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
        Clickster.currentUser.fetch();
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

    if (this.newUser) {
      $linkToSelect = this.$('a.sign-up-link');
    } else {
      $linkToSelect = this.$('a.sign-in-link');
    }

    $linkToSelect.addClass("selected");
    this.$("input.first").focus();

    return this;
  }
});
