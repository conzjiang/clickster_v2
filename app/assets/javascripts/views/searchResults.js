Clickster.Views.SearchResultsView = Backbone.View.extend({
  initialize: function (options) {
    if (options.params && !options.model) {
      this.model = Clickster.searchResults.getOrFetch(options.params);
    }

    this.subviews = [];
    this.listenTo(this.model, "change", this.render);
  },

  className: "search-results",

  template: JST["searches/results"],

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
      sortedResults = _(results).sortBy(compareFunc);
    } else {
      sortedResults = results;
      sortedResults.tvResults = _(results.tvResults).sortBy(compareFunc);
    }

    this.model.set("results", sortedResults);
  },

  render: function () {
    var results, twoPlyResults, content;

    this.removeSubviews();

    results = this.model.get("results");
    twoPlyResults = results && results.text;
    content = this.template({
      results: results,
      twoPlyResults: twoPlyResults
    });

    this.$el.html(content);
    if (results) this.renderResults();
    this.ellipsis();

    if (this.sort) {
      this.$("option[value='" + this.sort + "']").prop("selected", true);
    }

    return this;
  },

  renderResults: function () {
    var results, twoPlyResults, tvResults, userCardTemplate;

    results = this.model.get("results");
    tvResults = results.tvResults || results;
    that = this;

    tvResults.forEach(function (tv) {
      var tvCardView = new Clickster.Views.TvCardView({ tv: tv });
      that.addSubview({
        $container: that.$("ul.tv-results"),
        view: tvCardView
      });
    });

    twoPlyResults = results && results.text;

    if (twoPlyResults) {
      userCardTemplate = JST["searches/user"];

      results.userResults.forEach(function (user) {
        that.$("ul.user-results").append(userCardTemplate({ user: user }));
      });
    }
  },

  addSubview: function (options) {
    options.$container.append(options.view.render().$el);
    this.subviews.push(options.view);
  },

  removeSubviews: function () {
    this.subviews.forEach(function (view) {
      view.remove();
    });
  },

  remove: function () {
    this.removeSubviews();
    return Backbone.View.prototype.remove.call(this);
  }
});
