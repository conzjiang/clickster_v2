Clickster.Models.FeedItem = Backbone.Model.extend({
  subjectName: function () {
    if (this.aboutCurrentUser()) {
      return "you";
    } else {
      return this.escape("subject_name");
    }
  },

  aboutCurrentUser: function () {
    return this.get('subject_type') === 'Follow' &&
      this.get("subject_name") === Clickster.currentUser.get("username");
  },

  idolUrl: function () {
    return "#/users/" + this.escape("idol_id");
  },

  subjectUrl: function () {
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

    return "#/" + subjectType + "/" + subjectPath;
  }
})