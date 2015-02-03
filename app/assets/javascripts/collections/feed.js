Clickster.Collections.Feed = Backbone.Collection.extend({
  model: Clickster.Models.FeedItem,
  url: "api/current_user/feed",

  fetchNew: function (options) {
    var that, success;

    that = this;
    options = options || {};
    success = options.success;

    $.ajax({
      type: "get",
      url: this.url,
      dataType: "json",
      success: function (data) {
        var newModels = that.add(data);
        if (success) success(newModels);
      }
    });
  }
});