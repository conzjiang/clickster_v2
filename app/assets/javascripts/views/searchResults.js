Clickster.Views.SearchResultsView = Backbone.TvCardView.extend({
  initialize: function (options) {
    if (options.params && !options.model) {
      this.model = Clickster.searchResults.getOrFetch(options.params);
    }

    this.listenTo(this.model, "change", this.render);
  },

  className: "search-results",

  template: JST["searches/results"],

  events: {
    "submit form": "sort"
  },

  sort: function (e) {
    var comparator;

    e.preventDefault();
    comparator = this.comparator = $(e.target).serializeJSON().sort;

    switch (comparator) {
      case "A-Z":
        this.model.sortBy(Clickster.tvShows.comparator);
        break;
      case "Rating":
        this.model.sortBy(function (model) {
          return -model.get("rating");
        });
        break;
    };
  },

  render: function () {
    this.removeSubviews();

    var content = this.template({
      showUsers: this.model.get("showUsers"),
      tvResults: this.model.tvResults(),
      userResults: this.model.userResults()
    });

    this.$el.html(content);

    if (this.comparator) {
      this.$("option[value='" + this.comparator + "']").prop("selected", true);
    }

    return this;
  },

  renderResults: function () {
    var results, twoPlyResults, tvResults, userCardTemplate, that;

    results = this.model.get("results");
    tvResults = results.tvResults || results;
    this.renderCards(tvResults);

    twoPlyResults = results && results.text;

    if (twoPlyResults) {
      that = this;
      userCardTemplate = JST["searches/user"];

      results.userResults.forEach(function (user) {
        that.$("ul.user-results").append(userCardTemplate({ user: user }));
      });
    }
  }
});
