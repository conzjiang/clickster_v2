Clickster.Models.CurrentUser = Backbone.Model.extend({
  url: 'api/current_user',

  tvShows: function () {
    if (!this._tvShows) {
      this._tvShows = new Clickster.Collections.TvShows();
      this._tvShows.url = 'api/current_tv';
      this._tvShows.fetch();
    }

    return this._tvShows;
  }
});
