class FeedItem < ActiveRecord::Base
  validates :user_id, :idol_id, :tv_show_id, :message, presence: true

  belongs_to :user
  belongs_to :idol, class_name: "User"
  belongs_to :tv_show_id
end