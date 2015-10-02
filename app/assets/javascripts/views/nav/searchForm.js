Qliqster.Views.SearchFormView = Backbone.View.extend({
  className: "content",

  template: JST["nav/searchForm"],

  events: {
    "click .text-search-input": "expandInput",
    "blur .text-search-input": "revertInput",
    "submit form": "search",
    "touchmove label": "removeHover"
  },

  expandInput: function (e) {
    $(e.currentTarget).addClass("open");
    $(e.currentTarget).val("");
  },

  revertInput: function (e) {
    $(e.currentTarget).removeClass("open");
  },

  search: function (e) {
    e.preventDefault();
    $(e.currentTarget).find("button").prop("disabled", true);

    setTimeout(function () {
      this._closeMenu();

      Backbone.history.navigate("search?" + $(e.currentTarget).serialize(), {
        trigger: true
      });
    }.bind(this), 500);
  },

  removeHover: function (e) {
    var $label = $(e.currentTarget);

    if (!$label.siblings("input[type=checkbox]").is(":checked")) {
      $label.css("background", "#ccc");
    }
  },

  render: function () {
    this._openSearch();
    this.$el.html(this.template());
    return this;
  },

  _closeMenu: function () {
    Qliqster.currentUser.trigger("sync");
  },

  _openSearch: function () {
    Qliqster.eventManager.trigger("search");
  }
});
