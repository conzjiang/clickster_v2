Clickster.Collections.Lists = Backbone.Collection.extend({
  initialize: function (options) {
    this.user = options.user;
    this.url = options.url;
  },

  get: function (tv_show_id) {
    return this.findWhere({ tv_show_id: tv_show_id });
  },

  idAttribute: 'tv_show_id',

  send: function (attrs, options) {
    var that = this;
    var listItem = this.get(attrs.tv_show_id);

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

        if (options.success) options.success(data);
      }
    })
  }
});