Clickster.Views.TvFormView = Backbone.View.extend({
  initialize: function (options) {
    this.tv = options.tv;
    this.values = this.setValues(options.action);
    this.listenTo(this.tv, "change", this.render);
  },

  template: JST["tv_shows/_form"],

  events: {
    "click .filepicker-upload": "uploadImage",
    "submit .new-tv": "saveTV"
  },

  uploadImage: function (event) {
    var that = this;

    event.preventDefault();

    filepicker.pick(Clickster.filepickerOptions, function (blob) {
      that.tv.set("image_url", blob.url);
      that.$("img").attr("src", blob.url);
    });
  },

  saveTV: function (event) {
    event.preventDefault();
    var tvParams = $(event.target).serializeJSON().tv_show;
    var that = this;

    this.$(".error").removeClass("error");
    this.$(":input").prop("disabled", true);

    this.tv.save(tvParams, {
      wait: true,
      success: this.success.bind(this, this.tv.isNew()),
      error: this.renderErrors.bind(this)
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

    this.$("option[value='" + this.tv.get("status") + "']").
      prop("selected", true);

    return this;
  },

  renderErrors: function (attrs, data) {
    var errors = data.responseJSON;
    var $errorDisplay = this.$(".errors");
    $errorDisplay.empty();
    this.$(":input").prop("disabled", false);

    if (errors.imdb_id || Array.isArray(errors)) {
      var error = errors.imdb_id || errors[0];
      $errorDisplay.append("<li>" + error + "</li>");
    } else {
      Utils.renderErrors({
        view: this,
        errors: errors,
        fieldPrepend: "#tv_show_"
      });
    }
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
  },

  success: function (isNew, data) {
    if (isNew) {
      Clickster.currentUser.tvShows().add(this.tv);
      Clickster.tvShows.add(this.tv, { wait: true });
      Clickster.searchResults.addTextResult(this.tv);
    }

    Backbone.history.navigate("tv/" + this.tv.id, { trigger: true });
  }
});
