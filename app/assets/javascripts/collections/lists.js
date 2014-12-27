Clickster.Collections.Lists = Backbone.Collection.extend({
  initialize: function (models, options) {
    this.user = options.user;
  },

  getList: function (tv_show_id) {
    return this.findWhere({ tv_show_id: tv_show_id });
  },

  send: function (attrs, options) {
    var that = this;
    var listItem = this.getList(attrs.tv_show_id);
    var successCallback, errorCallback;

    if (options) {
      successCallback = options.success;
      errorCallback = options.error;
    }

    $.ajax({
      type: "post",
      url: this.url,
      data: attrs,
      dataType: "json",
      success: function (data) {
        if (data.destroyed) {
          that.remove(listItem);
        } else {
          that.add(data);
        }

        if (successCallback) successCallback(data);
      },
      error: errorCallback
    });
  }
});