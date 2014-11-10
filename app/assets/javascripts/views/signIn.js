Clickster.Views.SignIn = Backbone.View.extend({
  initialize: function (options) {
    this.newUser = options.newUser;
    this.listenTo(Clickster.currentUser, 'sync', this.render);
  },

  template: JST['signIn'],

  events: {
    'click a': 'toggleForm',
    'submit form': 'signInUser'
  },

  toggleForm: function () {
    var $link = $(event.target);
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
      success: function () {
        console.log('success')
        Clickster.currentUser.fetch();
        Backbone.history.navigate('', { trigger: true });
      },
      error: function (data) {
        that.$('.errors').empty();
        console.log('error')
        _(data.responseJSON).each(function (error) {
          that.$('.errors').append('<li>' + error + '</li>');
        });
      }
    })
  },

  render: function () {
    var signedIn = !!Clickster.currentUser.id;
    var that = this;

    var content = this.template({
      newUser: this.newUser,
      signedIn: signedIn
    });

    this.$el.html(content);

    if (this.newUser) {
      this.$('a.sign-up-link').addClass('selected');
    } else {
      this.$('a.sign-in-link').addClass('selected');
    }

    if (signedIn) {
      setTimeout(function () {
        $('.overlay').trigger('click');
        that.remove();
      }, 1000);
    }

    return this;
  }
});
