Clickster.Collections.SearchResults = Backbone.Collection.extend({
  initialize: function () {
    this.tvShows = new Clickster.Collections.TextResults();
    this.users = JSON.parse($('#users').html());
  },

  model: Clickster.Models.SearchResult,

  url: 'api/search',

  addTextResult: function (tvShow) {
    var result = new this.tvShows.model({
      id: tvShow.id,
      title: tvShow.get("title")
    });

    this.tvShows.add(result);
  },

  getOrFetch: function (params) {
    var result = this.findWhere({ params: params });
    var that = this;

    if (!result) {
      result = new this.model({ params: params });

      if (/text=/.test(params)) {
        var searchTerm = params.split(/text=/).slice(-1)[0].replace(/\+/g, " ");
        result = this.textSearch(searchTerm);

      } else {
        $.ajax({
          type: 'get',
          url: this.url,
          data: params,
          dataType: 'json',
          success: function (data) {
            result.set('results', data);
            that.add(result);
          }
        });
      }
    }

    return result;
  },

  include: function (title) {
    var tvShows = this.tvShows.map(function (tv) {
      return tv.title.toLowerCase();
    });

    return tvShows.indexOf(title.toLowerCase()) !== -1;
  },

  textSearch: function (searchTerm) {
    var query = new RegExp(Utils.strip(searchTerm), "i");

    var tvResults = this.tvShows.filter(function (tvShow) {
      return query.test(tvShow.strippedTitle);
    });

    var userResults = this.users.filter(function (user) {
      return query.test(Utils.strip(user.username));
    });

    return new this.model({
      params: "text=" + searchTerm,
      results: {
        text: true,
        tvResults: tvResults,
        userResults: userResults
      }
    });
  }
});
