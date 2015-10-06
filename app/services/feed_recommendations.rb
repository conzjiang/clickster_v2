class FeedRecommendations
  attr_reader :current_user, :limit

  def initialize(current_user, limit = nil)
    @current_user = current_user
    @limit = limit
  end

  def users
    if active_users.empty?
      recent_users
    else
      active_users
    end
  end

  private
  def active_users
    @active ||= User.recently_active(limit) - [current_user]
  end

  def recent_users
    @recent ||= User.order(created_at: :desc).limit(limit) - [current_user]
  end
end
