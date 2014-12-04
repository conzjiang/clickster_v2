Clickster.Collections.TextResults = Backbone.Collection.extend({
  initialize: function () {
    var tvs = JSON.parse($('#tv_shows').html());
    var that = this;

    _(tvs).each(function (attrs) {
      that.add(new that.model(attrs));
    });
  },

  model: Clickster.Models.TextResult,

  comparator: function (result) {
    return result.strippedTitle;
  }
});
