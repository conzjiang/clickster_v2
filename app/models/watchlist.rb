class Watchlist < ActiveRecord::Base
  enum status: ["Watching", "Plan to Watch", "Completed", "Dropped"]

  validates :tv_show, uniqueness: { scope: :watcher }
  validates :status, presence: true

  belongs_to :watcher, class_name: "User", inverse_of: :watchlists
  belongs_to :tv_show

  def self.statuses_list
    statuses.keys
  end
end