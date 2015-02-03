class FeedItem < ActiveRecord::Base
  validates :user_id, :message, presence: true

  belongs_to :user
  belongs_to :idol, class_name: "User"
  belongs_to :subject, polymorphic: true

  def feed_message
    subject_name = case subject_type
    when "Favorite", "Watchlist"
      subject.tv_show.title
    when "Follow"
      subject.idol.username
    end

    idol.username + message + subject_name
  end
end