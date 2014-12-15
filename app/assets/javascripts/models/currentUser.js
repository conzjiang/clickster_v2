Clickster.Models.CurrentUser = Clickster.Models.User.extend({
  initialize: function () {},

  url: 'api/current_user',

  isAdmin: function (tv) {
    if (!this.get("is_admin")) return false;
    return !!Clickster.currentUser.tvShows().get(tv.id);
  }
});
