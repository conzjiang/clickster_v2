Clickster.Collections.SearchResults = Backbone.Collection.extend({
  initialize: function () {
    this.tvShows = Utils.stripAll(JSON.parse($("#tv_shows").html()));
    this.users = Utils.stripAll(JSON.parse($("#users").html()));
  },

  model: Clickster.Models.SearchResult,

  url: "api/search",

  addTextResult: function (tvShow) {
    var title = tvShow.get("title");
    var result = {
      id: tvShow.id,
      title: title,
      pattern: Utils.strip(title)
    };

    this.tvShows.push(result);
  },

  getOrFetch: function (params) {
    var result = this.findWhere({ params: params });
    var model;

    if (!result) {
      if (/text=/.test(params)) {
        var searchTerm = params.split(/text=/).slice(-1)[0].replace(/\+/g, " ");
        var idData = this.processText(searchTerm);
        model = new this.model({ params: "text=" + searchTerm });
        result = this.add(model).textSearch(idData);

      } else {
        model = new this.model({ params: params });
        result = this.add(model).runQuery();
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

  processText: function (searchTerm) {
    var query = new RegExp(Utils.strip(searchTerm), "i");
    var getIds = function (items) {
      return _(items).filter(function (item) {
        return query.test(item.pattern);
      }).map(function (item) { return item.id; });
    };

    var tvIds = getIds(this.tvShows);
    var userIds = getIds(this.users);

    return {
      tvIds: tvIds,
      userIds: userIds
    };
  }
});
