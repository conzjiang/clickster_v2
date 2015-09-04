Clickster.Views.SearchResultsView = Backbone.TvCardsView.extend({
  initialize: function () {
    this.comparator = "alpha";
    this.collection = this.model.tvResults();

    this.listenTo(this.model, "sync", this.render);
    this.listenTo(this.model.tvResults(), "sort", this.render);
  },

  className: "search-results",

  template: JST["searches/results"],
  userTemplate: JST["users/_user"],

  events: {
    "change input[type=radio]": "sort"
  },

  sort: function (e) {
    e.preventDefault();
    this.comparator = $(e.currentTarget).serializeJSON().sort;

    switch (this.comparator) {
      case "alpha":
        this.model.sortBy(Clickster.tvShows.comparator);
        break;
      case "rating":
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
    this.renderResults();
    this.$("#sort_by_" + this.comparator).prop("checked", true);

    return this;
  },

  renderResults: function () {
    this.renderCards();
    this._renderUserResults();
  },

  _renderUserResults: function () {
    this.model.userResults().each(function (user) {
      this.$("ul.user-cards").append(this.userTemplate({ user: user }));
    }.bind(this));
  }
});
