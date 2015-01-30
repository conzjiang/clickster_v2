class FeedItem < ActiveRecord::Base
  validates :user_id, :message, presence: true

  belongs_to :user
  belongs_to :idol, class_name: "User"
  belongs_to :subject, polymorphic: true
end