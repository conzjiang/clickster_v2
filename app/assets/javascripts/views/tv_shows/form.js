Clickster.Views.TvFormView = Backbone.View.extend({
  initialize: function (options) {
    this.tv = options.tv;
    this.values = this.setValues(options.action);
    this.listenTo(this.tv, "change", this.render);
  },

  template: JST["tv_shows/_form"],

  events: {
    "submit .new-tv": "saveTV"
  },

  saveTV: function (event) {
    event.preventDefault();
    var tvParams = $(event.target).serializeJSON().tv_show;
    var that = this;

    this.tv.save(tvParams, {
      success: function (data) {
        Clickster.tvShows.add(that.tv, { wait: true });
        Clickster.searchResults.addTextResult(that.tv);
        Backbone.history.navigate("tv/" + data.id, { trigger: true });
      },

      error: function (attrs, data) {
        var errors = data.responseJSON;
        var $errorDisplay = that.$(".errors");
        $errorDisplay.empty();

        if (errors.imdb_id) {
          $errorDisplay.append("<li>" + errors.imdb_id + "</li>");
        } else {
          for (var attr in errors) {
            var $li = $("<li>");
            $li.html(Utils.convertToWords(attr) + " " + errors[attr][0]);
            $errorDisplay.append($li);

            that.$("#tv_show_" + attr).parent().addClass("error");
          }
        }
      }
    });
  },

  render: function () {
    var content = this.template(this.values);
    var that = this;

    this.$el.html(content);

    _(this.tv.get("genres")).each(function (genre) {
      var urlsafeGenre = genre.replace(/\//g, "");
      that.$("#form_genre_" + urlsafeGenre).prop("checked", true);
    });

    $("option[value='" + this.tv.get("status") + "']").
      prop("selected", true);

    return this;
  },

  setValues: function (action) {
    if (action === "new") {
      return {
        tv: this.tv,
        formHeader: "Add Manually",
        buttonContent: "Add Series"
      };
    } else {
      return {
        tv: this.tv,
        formHeader: "",
        buttonContent: "Update Series"
      };
    }
  }
});
