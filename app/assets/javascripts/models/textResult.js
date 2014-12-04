Clickster.Models.TextResult = Backbone.Model.extend({
  initialize: function (options) {
    this.id = options.id;
    this.title = options.title;
    this.strippedTitle = Utils.strip(options.title);
  }
});
