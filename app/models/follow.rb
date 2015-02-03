class Follow < ActiveRecord::Base
  include FeedItemSubject

  belongs_to :follower,
    class_name: "User",
    inverse_of: :follows

  belongs_to :idol,
    class_name: "User"

  validates :follower, :idol, presence: true
  validates :follower_id, uniqueness: { scope: :idol_id }

  def feed_message
    "is now following"
  end

  def user
    follower
  end
end