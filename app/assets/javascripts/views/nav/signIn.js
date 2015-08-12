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

  signInUser: function (event) {
    event.preventDefault();
    var $form = $(event.currentTarget);
    var params = $form.serializeJSON();
    var that = this;
    var buttonText = "Signing ";
    var $button = $form.find("button");
    var originalButtonText = $button.text();

    if (this.newUser) {
      buttonText += "up...";
    } else {
      buttonText += "in...";
    }

    $button.prop("disabled", true).html(buttonText);

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
        $button.prop("disabled", false).html(originalButtonText);

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
