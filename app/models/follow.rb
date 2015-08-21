class Follow < ActiveRecord::Base
  include FeedItemSubject

  belongs_to :follower,
    class_name: "User",
    inverse_of: :follows

  belongs_to :idol,
    class_name: "User"

  validates :follower, :idol, presence: true
  validates :follower_id, uniqueness: { scope: :idol_id }

  after_save :notify_idol

  def feed_message
    "is now following"
  end

  def user
    follower
  end

  private
  def notify_idol
    idol.feed_items.create!(
      subject: self,
      idol: follower,
      message: feed_message
    )
  end
end