Clickster.Views.TvFormView = Backbone.View.extend({
  initialize: function (options) {
    this.tv = options.tv;
    this.action = options.action;
    this.listenTo(this.tv, "change", this.render);
  },

  template: JST["tv_shows/_form"],

  events: {
    "click .image-url": "toggleImageInput",
    "change #tv_show_image": "uploadImage",
    "change #tv_show_image_url": "updateImage",
    "submit .new-tv": "saveTV"
  },

  values: function () {
    if (this.action === "new") {
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
    var content = this.template(this.values());
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

  uploadImage: function (e) {
    var file = e.currentTarget.files[0];
    var reader = new FileReader();

    reader.onloadend = function () {
      this.previewImage(reader.result);
      this.$("#tv_show_image_url").removeClass("show").val("");
      this.tv.set("image", reader.result);
    }.bind(this);

    if (file) {
      reader.readAsDataURL(file);
    } else {
      this.previewImage("");
    }
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
    this.previewImage($(e.currentTarget).val());
    this.image = null;
  },

  saveTV: function (e) {
    var tvParams;

    e.preventDefault();

    tvParams = $(e.currentTarget).serializeJSON().tv_show;
    if (tvParams.image === "") delete tvParams.image;

    this.tv.save(tvParams, {
      wait: true,
      success: this.success.bind(this),
      error: function (attrs, data) {
        this.resetForm();
        this.renderErrors(data.responseJSON);
      }.bind(this)
    });

    this.disableForm();
  },

  disableForm: function () {
    if (this.$("#tv_show_image_url").val() === "") {
      this.$imageField = this.$("#tv_show_image_field").html();
      this.$("#tv_show_image_field").empty();
    }

    this.$(".error").removeClass("error");
    this.$(":input").prop("disabled", true);
  },

  success: function () {
    if (this.action === "new") {
      Clickster.searchResults.addTextResult(this.tv);
    }

    Backbone.history.navigate("tv/" + this.tv.id, { trigger: true });
  },

  resetForm: function () {
    this.$(".errors").empty();
    this.$(":input").prop("disabled", false);

    if (this.$imageField) {
      this.$("#tv_show_image_field").html(this.$imageField);
      this.$imageField = null;
    }
  },

  renderErrors: function (errors) {
    if (errors.imdb_id || Array.isArray(errors)) {
      var error = errors.imdb_id || errors[0];
      this.$(".errors").append("<li>" + error + "</li>");
    } else {
      Utils.renderErrors({
        view: this,
        errors: errors,
        fieldPrepend: "#tv_show_"
      });
    }
  }
});
