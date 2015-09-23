class CreateDemoUser
  USERNAMES = %w(chipotle coca_cola LeBron ilikepie dangerous batman)

  attr_reader :demo_user

  def self.go!
    self.new(new_demo_user!).go!
  end

  def self.new_demo_user!(attrs = {})
    User.create_demo_user!(attrs)
  end

  def self.tv_shows
    @tv_shows ||= TvShow.all.to_a
  end

  def self.build_watchlists(user, num = 6)
    watchlists = []

    tv_shows.sample(num).each do |tv|
      watchlists << user.watchlists.new({
        tv_show_id: tv.id,
        status: Watchlist.statuses_list.sample
      })
    end

    watchlists
  end

  def self.build_favorites(user, num = 2)
    favorites = []

    tv_shows.sample(num).each do |tv|
      favorites << user.favorites.new(tv_show_id: tv.id)
    end

    favorites
  end

  def initialize(demo_user)
    @demo_user = demo_user
  end

  def go!
    create_watchlists!
    create_favorites!
    set_up_follows!

    demo_user
  end

  def create_watchlists!
    self.class.build_watchlists(demo_user).each(&:save!)
  end

  def create_favorites!
    self.class.build_favorites(demo_user).each(&:save!)
  end

  def set_up_follows!
    create_followers!
    set_up_feed_activity!
  end

  def create_followers!
    3.times { followers << create_follower! }

    follow!(followers.first)
    follow!(followers.last)
  end

  def followers
    @followers ||= []
  end

  def follow!(user)
    demo_user.follow!(user)
  end

  def set_up_feed_activity!
    follower_activities.each do |activity|
      activity.created_at = rand(20).minutes.ago
      activity.save!
    end

    nil
  end

  private

  def create_follower!
    username = usernames.pop

    follower = self.class.new_demo_user!({
      username: "#{username}#{rand(100)}"
    })

    follower.follow!(demo_user)
    follower
  end

  def follower_activities
    return @activities if @activities

    activities = []

    followers.each do |follower|
      activities += self.class.build_watchlists(follower)
      activities += self.class.build_favorites(follower, 1)
    end

    activities << followers.first.follow!(followers.second)

    @activities = activities.shuffle!
  end

  def usernames
    @usernames ||= USERNAMES.shuffle
  end
end
