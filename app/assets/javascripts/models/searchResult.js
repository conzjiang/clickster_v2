Clickster.Models.SearchResult = Backbone.Model.extend({
  runQuery: function () {
    $.ajax({
      type: "get",
      url: this.url(),
      data: this.get("params"),
      dataType: "json",
      success: function (data) {
        this.set("results", data);
      }.bind(this)
    });

    return this;
  },

  sortBy: function (comparator) {
    _(this.get('results')).sortBy(comparator);
  },

  textSearch: function (options) {
    var tvIds = options.tvIds, userIds = options.userIds;
    var results = {};
    var callback = function (data) {
      results.text = true;
      results.tvResults = data.tv_results || [];
      results.userResults = data.user_results || [];

      this.set("results", results);
    }.bind(this);

    $.ajax({
      type: "get",
      url: this.url() + "/ids",
      data: {
        tv_ids: tvIds,
        user_ids: userIds
      },
      dataType: "json",
      success: callback,
      error: callback
    });

    return this;
  }
});
