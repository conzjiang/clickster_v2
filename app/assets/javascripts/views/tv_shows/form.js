Clickster.Views.TvFormView = Backbone.View.extend({
  initialize: function (options) {
    this.tv = options.tv;
    this.values = this.setValues(options.action);
    this.listenTo(this.tv, "change", this.render);
  },

  template: JST["tv_shows/_form"],

  events: {
    "click .image-upload": "uploadImage",
    "click .image-url": "toggleImageInput",
    "change #tv_show_image_url": "updateImage",
    "submit .new-tv": "saveTV"
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

  render: function () {
    var content = this.template(this.values);
    this.$el.html(content);

    this.selectGenres();
    this.selectStatus();

    return this;
  },

  selectGenres: function () {
    _(this.tv.get("genres")).each(function (genre) {
      var urlsafeGenre = genre.replace(/\//g, "");
      this.$("#form_genre_" + urlsafeGenre).prop("checked", true);
    }.bind(this));
  },

  selectStatus: function () {
    this.$("option[value='" + this.tv.get("status") + "']").
      prop("selected", true);
  },

  uploadImage: function (event) {
    event.preventDefault();

    filepicker.pick(Clickster.filepickerOptions, function (blob) {
      this.$("#tv_show_image_url").removeClass("show").val("");
      this.tv.set("image_url", blob.url);
      this.previewImage(blob.url);
    }.bind(this));
  },

  previewImage: function (url) {
    this.$("img").attr("src", url);
  },

  toggleImageInput: function (e) {
    if ($(e.currentTarget).text() === "add image URL") {
      $(e.currentTarget).text("upload image");
    } else {
      $(e.currentTarget).text("add image URL");
    }

    this.$("#tv_show_image").toggleClass("hide");
    this.$("#tv_show_image_url").toggleClass("show").focus();
  },

  updateImage: function (e) {
    this.previewImage($(e.target).val());
  },

  saveTV: function (event) {
    var tvParams;

    event.preventDefault();
    tvParams = $(event.target).serializeJSON().tv_show;
    if (tvParams.image_url === "") delete tvParams.image_url;

    this.$(".error").removeClass("error");
    this.$(":input").prop("disabled", true);

    this.tv.save(tvParams, {
      wait: true,
      success: this.success.bind(this),
      error: function (attrs, data) {
        this.renderErrors(data.responseJSON);
      }.bind(this)
    });
  },

  success: function () {
    if (this.tv.isNew()) {
      Clickster.searchResults.addTextResult(this.tv);
    }

    Backbone.history.navigate("tv/" + this.tv.id, { trigger: true });
  },

  renderErrors: function (errors) {
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
  }
});
