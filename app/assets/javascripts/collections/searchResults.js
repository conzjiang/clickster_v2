Clickster.Collections.SearchResults = Backbone.Collection.extend({
  initialize: function () {
    this.tvShows = JSON.parse($('#tv_shows').html());
    this.users = JSON.parse($('#users').html());
  },

  model: Clickster.Models.SearchResult,

  url: 'api/search',

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
    var query = new RegExp(searchTerm, "i");
    var tvResults = [];
    var userResults = [];
    var that = this;

    _(this.tvShows).each(function (tvShow) {
      if (query.test(tvShow.title) || that._matchAnds(tvShow.title)) {
        tvResults.push(tvShow);
      }
    });

    _(this.users).each(function (user) {
      if (query.test(user)) {
        userResults.push(user);
      }
    });

    return new this.model({
      params: "text=" + searchTerm,
      results: {
        text: true,
        tvResults: tvResults,
        userResults: userResults
      }
    });
  },

  _matchAnds: function (title) {
    var and = title.match(/\sand\s/);
    var ampersand = title.match(/\s\&\s/);
    var match, matchesAnd;

    if (and) {
      match = title.replace(/\sand\s/, " & ");
    } else if (ampersand) {
      match = title.replace(/\s\&\s/, " and ");
    }

    if (match) matchesAnd = query.test(match);

    return matchesAnd;
  }
});
