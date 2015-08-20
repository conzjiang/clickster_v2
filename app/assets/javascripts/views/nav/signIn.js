Clickster.Views.SignInView = Backbone.View.extend({
  initialize: function (options) {
    this.newUser = false;
  },

  className: "content",

  template: JST['nav/signIn'],

  events: {
    'click .toggle': 'toggleForm',
    'click .facebook-login': 'fbLogin',
    'click .demo-login': 'signInDemo',
    'submit form': 'signInUser'
  },

  toggleForm: function (event) {
    event.stopPropagation();
    this.newUser = !this.newUser;
    this.render();
  },

  fbLogin: function (e) {
    $(e.currentTarget).prop("disabled", true).html("Signing in...");

    FB.login(this._requestCredsFromFacebook.bind(this), {
      scope: 'public_profile,email'
    });
  },

  _requestCredsFromFacebook: function () {
    FB.api('/me', function (data) {
      Clickster.currentUser.signIn({
        url: "/api/session/facebook",
        data: { facebook: data },
        success: function (resp) {
          if (resp.reload) {
            window.location.reload();
          } else {
            Backbone.history.navigate("facebook", { trigger: true });
          }
        }
      });
    });
  },

  signInDemo: function (e) {
    $(e.currentTarget).prop("disabled", true).html("Signing in...");

    Clickster.currentUser.demoSignIn({
      success: function () {
        window.location.reload();
      }
    });
  },

  signInUser: function (event) {
    event.preventDefault();
    var $form = $(event.currentTarget);

    this.disableButton();

    Clickster.currentUser.signIn({
      url: $form.attr("action"),
      data: $form.serializeJSON(),
      success: function () {
        window.location.reload();
      },
      error: function (data) {
        this.enableButton();
        this.renderErrors(data.responseJSON);
        this.$("input.first").select();
      }.bind(this)
    });
  },

  disableButton: function () {
    if (this.newUser) {
      this.setButton("Signing up...", true);
    } else {
      this.setButton("Signing in...", true);
    }
  },

  enableButton: function () {
    if (this.newUser) {
      this.setButton("Sign up", false);
    } else {
      this.setButton("Sign in", false);
    }
  },

  setButton: function (text, disabled) {
    this.$(".login").prop("disabled", disabled).html(text);
  },

  renderErrors: function (errors) {
    this.$('.errors').empty();

    _(data.responseJSON).each(function (error) {
      this.$('.errors').append('<li>' + error + '</li>');
    }.bind(this));
  },

  render: function () {
    var content = this.template({
      newUser: this.newUser,
      signedIn: !!Clickster.currentUser.id
    });

    this.$el.html(content);
    this.$("input.first").focus();
    this.initializeFbLogin();

    return this;
  },

  initializeFbLogin: function () {
    if (this.init) return;

    this.init = true;
    $.ajaxSetup({ cache: true });

    FB.init({
      appId: Clickster.FbAppId,
      version: 'v2.3'
    });
  }
});
