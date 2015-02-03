Clickster.Collections.Feed = Backbone.Collection.extend({
  model: Clickster.Models.FeedItem,
  url: "api/current_user/feed",

  fetchNew: function () {
    var lastFetched, that;

    if (!this.isEmpty()) lastFetched = this.last().get("created_at");
    that = this;

    $.ajax({
      type: "get",
      url: this.url,
      data: { last_fetched: lastFetched },
      dataType: "json",
      success: function (data) {
        var newModels = that.add(data);
        that.trigger("update", newModels);
      }
    });
  }
});