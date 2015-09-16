Clickster.Collections.Feed = Backbone.Collection.extend({
  model: Clickster.Models.FeedItem,
  url: "api/feed",

  comparator: function (model) {
    return Date.parse(model.get("created_at"));
  },

  fetchNew: function () {
    var lastFetched;

    if (!this.isEmpty()) {
      lastFetched = this.last().get("created_at");
    }

    $.ajax({
      method: "get",
      url: this.url + "/new",
      data: { last_fetched: lastFetched },
      dataType: "json",
      success: this.parseNew.bind(this)
    });
  },

  parse: function (resp) {
    return resp.new_items;
  },

  parseNew: function (resp) {
    if (resp.recommendations) {
      this.recommendations().set(resp.recommendations);
      this.recommendations().hasIdols = resp.has_idols;
      this.trigger("empty");
      return;
    }

    if (resp.new_items.length) {
      this.add(resp.new_items).forEach(function (item) {
        this.trigger("newItem", item);
      }.bind(this));
    }
  },

  recommendations: function () {
    if (!this._recommendations) {
      this._recommendations = new Clickster.Collections.Users();
    }

    return this._recommendations;
  }
});
