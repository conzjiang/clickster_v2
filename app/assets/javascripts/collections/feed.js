Clickster.Collections.Feed = Backbone.Collection.extend({
  model: Clickster.Models.FeedItem,
  url: "api/current_user/feed",

  fetchNew: function () {
    var lastFetched;

    if (!this.isEmpty()) {
      lastFetched = this.last().get("created_at");
    }

    $.ajax({
      method: "get",
      url: this.url,
      data: { last_fetched: lastFetched },
      dataType: "json",
      success: this.parseNew.bind(this)
    });
  },

  parseNew: function (resp) {
    if (resp.recommendations) {
      this.recommendations().set(resp.recommendations);
      this.recommendations().hasIdols = resp.has_idols;
      this.trigger("empty");
      return;
    }

    this.trigger("updated", this.add(resp.new_items));
  },

  recommendations: function () {
    if (!this._recommendations) {
      this._recommendations = new Clickster.Collections.Users();
    }

    return this._recommendations;
  }
});
