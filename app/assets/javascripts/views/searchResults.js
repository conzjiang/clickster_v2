Clickster.Views.SearchResultsView = Backbone.View.extend({
  initialize: function (options) {
    if (options.params && !options.model) {
      this.model = Clickster.searchResults.getOrFetch(options.params);
    }

    this.listenTo(this.model, "change", this.render);
  },

  className: "search-results",
  template: JST["searches/results"],
  tvResultTemplate: JST["searches/tv"],
  userResultTemplate: JST["searches/user"],

  events: {
    "submit form": "sort"
  },

  sort: function (e) {
    var comparator, results, compareFunc, sortedResults;

    e.preventDefault();
    comparator = this.sort = $(e.target).serializeJSON().sort;
    results = this.model.get("results");

    switch (comparator) {
      case "A-Z":
        compareFunc = Clickster.tvShows.comparator;
        break;
      case "Rating":
        compareFunc = function (model) {
          return -model.get("rating");
        };
        break;
    };

    if (Array.isArray(results)) {
      sortedResults = _(results).sortBy(compare);
    } else {
      sortedResults = results;
      sortedResults.tvResults = _(results.tvResults).sortBy(compare);
    }

    this.model.set("results", sortedResults);
  },

  render: function () {
    var content = this.template({
      results: this.model.get("results") || [],
      tvResult: this.tvResultTemplate,
      userResult: this.userResultTemplate
    });

    this.$el.html(content);
    this.ellipsis();

    if (this.sort) {
      this.$("option[value='" + this.sort + "']").prop("selected", true);
    }

    return this;
  }
});
