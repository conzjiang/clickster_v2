Clickster.Views.SearchFormView = Backbone.View.extend({
  className: "content",

  template: JST["searchForm"],

  events: {
    "click input[name=query]": "expandInput",
    "blur input[name=query]": "revertInput",
    "submit form.search": "textSearch",
    "submit form.discover": "runQuery",
    "touchmove label": "removeHover"
  },

  expandInput: function (event) {
    $(event.target).addClass("open");
    $(event.target).val("");
  },

  revertInput: function (event) {
    $(event.target).removeClass("open");
  },

  textSearch: function (event) {
    event.preventDefault();
    var searchTerm = this.$("input").val();

    this._closeMenu();
    Backbone.history.navigate("search?text=" + searchTerm, {
      trigger: true
    });
  },

  runQuery: function (event) {
    event.preventDefault();
    var params = $(event.target).serialize();

    Backbone.history.navigate("search?" + params, { trigger: true });
    this._closeMenu();
  },

  removeHover: function () {
    var $label = $(event.target);

    if (!$label.siblings("input[type=checkbox]").is(":checked")) {
      $label.css("background", "#ccc");
    }
  },

  render: function () {
    this.$el.html(this.template());
    return this;
  },

  _closeMenu: function () {
    this.$el.closest(".search-form").removeClass("show");
  }
});
