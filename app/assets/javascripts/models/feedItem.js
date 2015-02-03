Clickster.Models.FeedItem = Backbone.Model.extend({
  initialize: function () {
    this.setUrls();
  },

  setUrls: function () {
    this.setIdolUrl();
    this.setSubjectUrl();
  },

  setIdolUrl: function () {
    this.idolUrl = "#/users/" + this.escape("idol_name");
  },

  setSubjectUrl: function () {
    var subjectType, subjectPath;

    switch(this.get("subject_type")) {
      case "Watchlist":
      case "Favorite":
        subjectType = "tv";
        subjectPath = this.get("subject_id");
        break;
      case "Follow":
        subjectType = "users";
        subjectPath = this.escape("subject_name");
        break;
    }

    this.subjectUrl = "#/" + subjectType + "/" + subjectPath;
  }
})