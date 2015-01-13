Clickster.Views.NewTvView = Backbone.View.extend({
  initialize: function (options) {
    this.tv = options.tv || new Clickster.Models.TvShow();
    this.action = options.action;
    this.listenTo(Clickster.currentUser, "sync", this.render);
  },

  className: "forms tv-forms",

  newTemplate: JST["tv_shows/new"],

  editTemplate: JST["tv_shows/edit"],

  template: function (values) {
    if (this.action === "new") {
      return this.newTemplate(values);
    } else {
      return this.editTemplate(values);
    }
  },

  events: {
    "submit .new-imdb-tv": "autocomplete"
  },

  autocomplete: function (event) {
    event.preventDefault();

    var title = $(event.target).serializeJSON().title;
    var params = {
      plot: "short",
      r: "json",
      t: title,
      type: "series"
    };
    var that = this;

    if (Clickster.searchResults.include(title)) {
      this._updateSearchStatus("Series already exists in the database!");
      return;
    }

    this.tv.clear({ silent: true });
    this._updateSearchStatus("Searching...");

    $.ajax({
      type: "get",
      url: "http://omdbapi.com",
      data: params,
      dataType: "json",
      success: function (data) {
        if (data.Response === "False") {
          that._updateSearchStatus("No results!");
        } else {
          that.tv.setYears(data.Year);
          that.tv.setGenres(data.Genre);

          var attrs = {
            blurb: data.Plot,
            title: data.Title,
            imdb_id: data.imdbID,
            rating: data.imdbRating
          };

          that.tv.set(attrs);
          that._updateSearchStatus("Found!");
        }
      },
      error: function () {
        that._updateSearchStatus("No results!");
      }
    });
  },

  form: function () {
    if (!this._form) {
      this._form = new Clickster.Views.TvFormView({
        tv: this.tv,
        action: this.action
      });
    }

    return this._form;
  },

  render: function (status) {
    if (!Clickster.currentUser.get("is_admin")) {
      this.$el.html("You are not allowed to perform this action.");
      return this;
    }

    var content = this.template({ tv: this.tv, action: this.action });
    this.$el.html(content);
    this.$el.append(this.form().render().$el);

    return this;
  },

  remove: function () {
    this.form().remove();
    return Backbone.View.prototype.remove.apply(this);
  },

  _updateSearchStatus: function (status) {
    this.$("p.search-status").html(status);
  }
});
