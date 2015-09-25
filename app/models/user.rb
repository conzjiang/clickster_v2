class User < ActiveRecord::Base
  include BCrypt

  MAX_USERNAME_LENGTH = 11

  attr_reader :password

  has_attached_file :image,
    default_url: :get_default_image,
    styles: {
      thumb: '50x50#',
      profile: '150x150#'
    }

  validates_attachment :image, content_type: { content_type: /\Aimage\/.*\Z/ }

  validates :email, presence: true, uniqueness: true

  validates :username,
    presence: true,
    length: { minimum: 3, maximum: MAX_USERNAME_LENGTH }

  validates :username, uniqueness: true, unless: :facebook_user?
  validates :password, length: { minimum: 6, allow_nil: true }

  before_destroy :destroy_followers_for_demo_user
  before_destroy :deassociate_admin_tv_shows

  has_many :tv_shows, foreign_key: :admin_id
  has_many :watchlists,
    foreign_key: :watcher_id,
    inverse_of: :watcher,
    dependent: :destroy
  has_many :watchlist_shows, through: :watchlists, source: :tv_show
  has_many :favorites, foreign_key: :favoriter_id, dependent: :destroy
  has_many :favorite_shows, through: :favorites, source: :tv_show
  has_many :follows,
    foreign_key: :follower_id,
    inverse_of: :follower,
    dependent: :destroy
  has_many :idols, through: :follows, source: :idol
  has_many :followings,
    class_name: "Follow",
    foreign_key: :idol_id,
    dependent: :destroy
  has_many :followers, through: :followings
  has_many :feed_items

  has_many :activity,
    class_name: "FeedItem",
    foreign_key: :idol_id

  after_initialize :ensure_session_token

  def self.create_demo_user!(attrs = {})
    attrs[:username] ||= "guest#{SecureRandom.urlsafe_base64(3)}"

    create!({
      email: "#{attrs[:username]}@example.com",
      password: SecureRandom.urlsafe_base64(6)
    }.merge!(attrs))
  end

  def self.find_by_credentials(identifier, password)
    user = User.where("username = :id OR email = :id", id: identifier).first
    user.try(:is_password?, password) ? user : nil
  end

  def self.find_or_create_by_omniauth_params(params)
    user = User.find_by(uid: params[:id])
    return user if user

    user = User.find_by(email: params[:email])

    if user
      user.update!(uid: params[:id])
      user
    else
      create_from_omniauth_params!(params)
    end
  end

  def self.create_from_omniauth_params!(params)
    first_name = params[:first_name].first(MAX_USERNAME_LENGTH - 3)
    last_initial = params[:last_name].first
    temp_username = "#{first_name}#{last_initial}#{rand(100)}"

    User.create!({
      username: temp_username,
      email: params[:email],
      password: SecureRandom.urlsafe_base64(6),
      uid: params[:id]
    })
  end

  def self.recently_active(limit = nil)
    recent = joins(:watchlists).
      where("watchlists.created_at > ?", 1.day.ago).
      limit(limit)

    return recent unless recent.empty?

    order(created_at: :desc).limit(limit)
  end

  def self.with_watch_and_favorite_count
    select(select_watch_and_favorite_count).
      joins(watchlists_join).
      joins(favorites_join).
      group("users.id")
  end

  def admins?(tv_show)
    tv_shows.map(&:id).include?(tv_show.id)
  end

  def demo_user?
    !!username.match(/^guest/) && email == "#{username}@example.com"
  end

  def facebook_user?
    uid.present?
  end

  def favorite!(tv_show)
    favorites.create!(tv_show: tv_show)
  end

  def follow!(user)
    follows.create!(idol_id: user.id)
  end

  def following?(user)
    follows.map(&:idol_id).include?(user.id)
  end

  def is_password?(password)
    Password.new(self.password_digest).is_password?(password)
  end

  def likes?(tv_show)
    favorites.map(&:tv_show_id).include?(tv_show.id)
  end

  def listed?(tv_show)
    watchlists.map(&:tv_show_id).include?(tv_show.id)
  end

  def password=(password)
    @password = password
    self.password_digest = Password.create(password)
  end

  def reset_session_token!
    self.session_token = SecureRandom.urlsafe_base64(16)
    self.save!
    self.session_token
  end

  def sign_out!
    if demo_user?
      destroy!
      nil
    else
      reset_session_token!
    end
  end

  def watchlist_shows_with_statuses
    return @shows if @shows

    @shows = TvShow.
      select("tv_shows.*, watchlists.status AS watch_status_idx").
      joins(<<-SQL)
        JOIN
          (#{Watchlist.where(watcher_id: id).to_sql}) AS watchlists
        ON
          watchlists.tv_show_id = tv_shows.id
      SQL

    @shows.each do |tv|
      tv.define_singleton_method(:watch_status) do
        Watchlist.statuses_list[watch_status_idx]
      end
    end
  end

  private

  def self.select_watch_and_favorite_count
    <<-SQL
      users.*,
      COUNT(DISTINCT watchlists.id) AS watch_count,
      COUNT(DISTINCT favorites.id) AS favorite_count
    SQL
  end

  def self.watchlists_join
    watching = Watchlist.where(status: "Watching")

    <<-SQL
      LEFT OUTER JOIN
        (#{watching.to_sql}) AS watchlists
      ON
        watchlists.watcher_id = users.id
    SQL
  end

  def self.favorites_join
    <<-SQL
      LEFT OUTER JOIN
        favorites
      ON
        favorites.favoriter_id = users.id
    SQL
  end

  def destroy_followers_for_demo_user
    return true unless demo_user?

    User.
      select("users.*").
      joins(:follows).
      where("follows.idol_id = ?", id).
      order("follows.created_at").
      limit(3).
      destroy_all
  end

  def deassociate_admin_tv_shows
    return true unless is_admin?
    tv_shows.update_all(admin_id: nil)
  end

  def ensure_session_token
    self.session_token ||= SecureRandom.urlsafe_base64(16)
  end

  def get_default_image
    demo_friend = CreateDemoUser::USERNAMES.find { |name| username.match(name) }
    return "#{demo_friend}.jpg" if demo_friend

    "guest#{id % 5 + 1}.jpg"
  end
end
