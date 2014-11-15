Clickster.Views.NewTv = Backbone.View.extend({
  initialize: function () {
    this.tv = new Clickster.Models.TvShow();

    this.listenTo(this.tv, 'change', this.render);
  },

  className: 'tv-forms',

  template: JST['tv_shows/new'],

  events: {
    'submit .new-imdb-tv': 'autocomplete'
  },

  autocomplete: function (event) {
    event.preventDefault();

    var title = $(event.target).serializeJSON().title;
    var params = {
      plot: 'short',
      r: 'json',
      t: title
    };
    var that = this;

    $.ajax({
      type: 'get',
      url: 'http://omdbapi.com',
      data: params,
      dataType: 'json',
      success: function (data) {
        that.tv.setYears(data.Year);
        that.tv.setGenres(data.Genre);

        var attrs = {
          blurb: data.Plot,
          title: data.Title,
          imdb_id: data.imdbID,
          rating: data.imdbRating
        };

        that.tv.set(attrs);
      }
    });
  },

  render: function () {
    var that = this;

    this.$el.html(this.template({ tv: this.tv }));

    _(this.tv.get('genres')).each(function (genre) {
      that.$('#form_genre_' + genre.replace(/\//g, '')).prop('checked', true);
    });

    $('option[value="' + this.tv.get('status') + '"]').prop('selected', true);

    return this;
  }
});
