Clickster.Collections.Lists = Backbone.Collection.extend({
  initialize: function (options) {
    this.user = options.user;
    this.url = options.url;
  },

  get: function (tv_show_id) {
    return this.findWhere({ tv_show_id: tv_show_id });
  },

  remove: function (model, options) {
    var that = this;

    $.ajax({
      type: "post",
      url: this.url,
      data: model,
      success: function () {
        Backbone.Collection.prototype.remove.call(that, model);
        if (options.success) options.success();
      }
    });
  }
});