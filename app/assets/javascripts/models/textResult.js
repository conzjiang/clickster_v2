Clickster.Models.TextResult = Backbone.Model.extend({
  initialize: function (options) {
    this.id = options.id;
    this.strippedQuery = Utils.strip(options.pattern);
  }
});
