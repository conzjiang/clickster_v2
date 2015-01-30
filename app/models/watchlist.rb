class Watchlist < ActiveRecord::Base
  enum status: ["Watching", "Plan to Watch", "Completed", "Dropped"]

  validates :tv_show_id, uniqueness: { scope: :watcher_id }
  validates :status, presence: true

  belongs_to :watcher, class_name: "User", inverse_of: :watchlists
  belongs_to :tv_show

  after_save :create_feed_items

  def self.statuses_list
    statuses.keys
  end

  private
  def create_feed_items
    follower_ids = watcher.followings.pluck(:follower_id)
    feed_items = follower_ids.map do |follower_id|
      message = case status
      when "Watching"
        " is watching "
      when "Plan to Watch"
        " plans to watch "
      when "Completed"
        " has finished watching "
      when "Dropped"
        " stopped watching "
      end

      FeedItem.new(user_id: follower_id, subject: self, idol_id: watcher.id, message: message)
    end

    FeedItem.import(feed_items)
  end
end