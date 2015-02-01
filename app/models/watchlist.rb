class Watchlist < ActiveRecord::Base
  include FeedItemSubject

  enum status: ["Watching", "Plan to Watch", "Completed", "Dropped"]

  validates :watcher_id, uniqueness: { scope: :tv_show_id }
  validates :status, :watcher, presence: true

  belongs_to :watcher, class_name: "User", inverse_of: :watchlists
  belongs_to :tv_show

  def self.statuses_list
    statuses.keys
  end

  def feed_message
    case status
    when "Watching"
      " is watching "
    when "Plan to Watch"
      " plans to watch "
    when "Completed"
      " has finished watching "
    when "Dropped"
      " stopped watching "
    end
  end

  def user
    watcher
  end
end