class Follow < ActiveRecord::Base
  belongs_to :follower,
    class_name: "User",
    inverse_of: :follows

  belongs_to :idol,
    class_name: "User"

  validates :follower, :idol, presence: true
  validates :follower_id, uniqueness: { scope: :idol_id }
end