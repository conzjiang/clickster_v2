Clickster.Views.EditTvView = Backbone.View.extend({
  initialize: function (options) {
    this.tv = options.tv;

    this.listenTo(this.tv, "sync", this.render);
  },

  className: "tv-forms",

  template: JST["tv_shows/edit"],

  form: JST["tv_shows/_form"],

  events: {
    "submit form": "updateTv"
  },

  updateTv: function (event) {
    event.preventDefault();

    var params = $(event.target).serializeJSON();
    var that = this;

    this.tv.save(params.tv_show, {
      success: function () {
        Backbone.history.navigate("tv/" + that.tv.id, { trigger: true });
      },
      error: function (data, error) {
        var errors = error.responseJSON;
        var $errorDisplay = that.$(".errors");
        $errorDisplay.empty();

        for (var attr in errors) {
          var $li = $("<li>");
          $li.html(Utils.convertToWords(attr) + " " + errors[attr][0]);
          $errorDisplay.append($li);

          that.$("#tv_show_" + attr).parent().addClass("error");
        }
      }
    });
  },

  render: function () {
    var content = this.template({ tv: this.tv });
    var form = this.form({
      tv: this.tv,
      formHeader: "",
      buttonContent: "Update Series"
    });
    var that = this;

    this.$el.html(content);
    this.$el.append(form);

    _(this.tv.get("genres")).each(function (genre) {
      var urlsafeGenre = genre.replace(/\//g, "");
      that.$("#form_genre_" + urlsafeGenre).prop("checked", true);
    });

    $("option[value='" + this.tv.get("status") + "']").prop("selected", true);

    return this;
  }
});
