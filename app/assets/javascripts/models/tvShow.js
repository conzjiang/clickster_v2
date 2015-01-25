Clickster.Models.TvShow = Backbone.Model.extend({
  initialize: function () {
    if (!this.get("genres")) this.set("genres", []);
  },

  urlRoot: "api/tv_shows",

  belongsTo: function (genre) {
    return this.get("genres").indexOf(genre) !== -1;
  },

  favorite: function (options) {
    $.ajax({
      type: "post",
      url: this.url() + "/favorite",
      dataType: "json",
      success: function (data) {
        this.set(data);

        if (options.success) options.success();
      }.bind(this)
    });
  },

  setGenres: function (genreStr) {
    var genres = genreStr.split(", ");
    var that = this;

    this.set("genres", []);

    _(genres).each(function (genre) {
      var tvGenre;

      if (Clickster.GENRES.indexOf(genre) === -1) {
        tvGenre = _(Clickster.GENRES).find(function (dbGenre) {
          return dbGenre.match(genre);
        });
      } else {
        tvGenre = genre;
      }

      if (tvGenre) that.get("genres").push(tvGenre);
    });
  },

  setYears: function (yearStr) {
    var years = yearStr.split("–");
    this.set("start_year", parseInt(years[0]));

    if (years[1]) {
      this.set("end_year", parseInt(years[1]));
    } else {
      this.set("status", "Currently Airing");
    }
  },

  toJSON: function () {
    return { tv_show: this.attributes };
  }
});
