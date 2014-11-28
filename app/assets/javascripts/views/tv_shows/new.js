Clickster.Views.NewTv = Backbone.View.extend({
  initialize: function () {
    this.tv = new Clickster.Models.TvShow();

    this.listenTo(this.tv, 'change', this.render);
    this.listenTo(Clickster.currentUser, "sync", this.render);
  },

  className: 'tv-forms',

  template: JST['tv_shows/new'],

  events: {
    'submit .new-imdb-tv': 'autocomplete',
    'submit .new-tv': 'createTV'
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

    this.tv.clear({ silent: true });
    this._updateSearchStatus('Searching...');

    $.ajax({
      type: 'get',
      url: 'http://omdbapi.com',
      data: params,
      dataType: 'json',
      success: function (data) {
        if (data.Response === 'False') {
          that._updateSearchStatus('No results!');
        } else {
          that.tv.setYears(data.Year);
          that.tv.setGenres(data.Genre);

          var attrs = {
            blurb: data.Plot,
            title: data.Title,
            imdb_id: data.imdbID,
            rating: data.imdbRating
          };

          that.searchResult = true;
          that.tv.set(attrs);
        }
      },
      error: function () {
        that._updateSearchStatus('No results!');
      }
    });
  },

  createTV: function (event) {
    event.preventDefault();
    var tvParams = $(event.target).serializeJSON().tv_show;
    var that = this;

    this.tv.save(tvParams, {
      success: function (data) {
        Clickster.tvShows.add(that.tv, { wait: true });
        Backbone.history.navigate('tv/' + data.id, { trigger: true });
      },

      error: function (attrs, data) {
        var errors = data.responseJSON;
        var $errorDisplay = that.$('.errors');
        $errorDisplay.empty();

        if (errors.imdb_id) {
          $errorDisplay.append('<li>' + errors.imdb_id + '</li>');
        } else {
          for (var attr in errors) {
            var $li = $('<li>');
            $li.html(Utils.convertToWords(attr) + ' ' + errors[attr][0]);
            $errorDisplay.append($li);

            that.$('#tv_show_' + attr).parent().addClass('error');
          }
        }
      }
    });
  },

  render: function (status) {
    if (Clickster.currentUser.get("is_admin")) {
      var that = this;

      this.$el.html(this.template({ tv: this.tv }));

      if (this.searchResult) {
        this._updateSearchStatus('Found!');
        this.searchResult = false;
      }

      _(this.tv.get('genres')).each(function (genre) {
        var urlsafeGenre = genre.replace(/\//g, '');
        that.$('#form_genre_' + urlsafeGenre).prop('checked', true);
      });

      $('option[value="' + this.tv.get('status') + '"]').prop('selected', true);
    }

    return this;
  },

  _updateSearchStatus: function (status) {
    this.$('p.search-status').html(status);
  }
});
