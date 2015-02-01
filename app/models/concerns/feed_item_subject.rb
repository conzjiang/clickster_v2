require 'active_support/concern'

module FeedItemSubject
  extend ActiveSupport::Concern

  included do
    has_many :feed_items, as: :subject
    after_save :create_feed_items
  end

  def feed_message
    raise NotImplementedError.new("Must implement message for feed item")
  end

  def user
    raise NotImplementedError.new("Must assign user association for feed item")
  end

  private
  def create_feed_items
    purge_quick_switches

    follower_ids = user.followings.pluck(:follower_id)
    feed_items = follower_ids.map do |follower_id|
      FeedItem.new(
        user_id: follower_id,
        subject: self,
        idol_id: user.id,
        message: feed_message
      )
    end

    FeedItem.import(feed_items)
  end

  def purge_quick_switches
    recent_items.destroy_all
  end

  def recent_items
    feed_items.where("created_at > ?", 1.minute.ago)
  end
end