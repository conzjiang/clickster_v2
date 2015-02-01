class Favorite < ActiveRecord::Base
  include FeedItemSubject

  validates :favoriter_id, uniqueness: { scope: :tv_show_id }
  validates :tv_show, presence: true

  belongs_to :favoriter, class_name: "User"
  belongs_to :tv_show

  after_destroy :purge_quick_switches

  def feed_message
    " favorited "
  end

  def user
    favoriter
  end
end