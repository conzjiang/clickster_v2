Clickster.Views.SignInView = Backbone.View.extend({
  initialize: function (options) {
    this.newUser = false;
  },

  className: "content",

  template: JST['nav/signIn'],

  events: {
    'click .toggle': 'toggleForm',
    'submit form': 'signInUser',
    'click .demo-login': 'signInDemo'
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

    Clickster.currentUser.signIn({
      url: $form.attr("action"),
      data: params,
      success: function () {
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
    });
  },

  signInDemo: function (e) {
    var $button = $(e.currentTarget);
    $button.prop("disabled", true).html("Signing in...");

    Clickster.currentUser.demoSignIn({
      success: function () {
        window.location.reload();
      }
    });
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
