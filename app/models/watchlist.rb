class Watchlist < ActiveRecord::Base
  include FeedItemSubject

  enum status: ["Watching", "Plan to Watch", "Completed", "Dropped"]

  STATUS_MESSAGES = {
    "Watching" => "is watching",
    "Plan to Watch" => "plans to watch",
    "Completed" => "has finished watching",
    "Dropped" => "stopped watching"
  }

  validates :watcher_id, uniqueness: { scope: :tv_show_id }
  validates :status, :watcher, presence: true

  belongs_to :watcher, class_name: "User", inverse_of: :watchlists
  belongs_to :tv_show

  def self.statuses_list
    statuses.keys
  end

  def feed_message
    STATUS_MESSAGES[status]
  end

  def user
    watcher
  end
end