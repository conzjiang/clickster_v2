Clickster.Collections.Lists = Backbone.Collection.extend({
  initialize: function (models, options) {
    this.user = options.user;
  },

  add: function (model) {
    var toAdd, list,
        add = Backbone.Collection.prototype.add.bind(this);

    if (model instanceof Clickster.Models.TvShow) {
      if (list = this.getList(model.id)) {
        list.set("status", model.get("watch_status"));
        return;
      }

      toAdd = {
        tv_show_id: model.id,
        status: model.get("watch_status"),
        title: model.get("title"),
        image_url: model.get("image_url")
      };
    } else {
      toAdd = model;
    }

    return add(toAdd);
  },

  getList: function (tv_show_id) {
    return this.findWhere({ tv_show_id: tv_show_id });
  },

  remove: function (model) {
    var toRemove,
        remove = Backbone.Collection.prototype.remove.bind(this);

    if (model instanceof Clickster.Models.TvShow) {
      toRemove = this.getList(model.id);
    } else {
      toRemove = model;
    }

    return remove(toRemove);
  }
});