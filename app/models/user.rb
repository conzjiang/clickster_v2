class User < ActiveRecord::Base
  include BCrypt
  attr_reader :password

  validates :email, :username, presence: true, uniqueness: true
  validates :username, length: { minimum: 3, maximum: 12 }
  validates :password, length: { minimum: 6, allow_nil: true }

  before_destroy :destroy_followers_for_demo_user

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

  after_initialize :ensure_session_token

  def self.create_demo_user!(username = nil)
    username ||= "guest#{SecureRandom.urlsafe_base64(3)}"

    create!({
      username: username,
      email: "#{username}@example.com",
      password: SecureRandom.urlsafe_base64(6)
    })
  end

  def self.find_by_credentials(identifier, password)
    user = User.where("username = :id OR email = :id", id: identifier).first
    user.try(:is_password?, password) ? user : nil
  end

  def self.find_or_create_by_omniauth_params(omniauth_hash)
    uid = omniauth_hash['uid']
    user = User.find_by(uid: uid)
    return user if user

    user_info = omniauth_hash['info']
    user = User.find_by(email: user_info['email'])

    if user
      user.update!(uid: uid)
      user
    else
      temp_username = "#{user_info['name'].gsub(" ", "")}#{rand(100)}"

      User.create!({
        username: temp_username,
        email: user_info['email'],
        password: SecureRandom.urlsafe_base64(6),
        uid: uid
      })
    end
  end

  def admins?(tv_show)
    tv_shows.pluck(:id).include?(tv_show.id)
  end

  def demo_user?
    !!username.match(/^guest/) && email == "#{username}@example.com"
  end

  def favorite!(tv_show)
    favorites.create!(tv_show: tv_show)
  end

  def follow!(user)
    follows.create!(idol_id: user.id)
  end

  def following?(user)
    follows.exists?(idol_id: user.id)
  end

  def is_password?(password)
    Password.new(self.password_digest).is_password?(password)
  end

  def likes?(tv_show)
    self.favorites.map(&:tv_show_id).to_a.include?(tv_show.id)
  end

  def listed?(tv_show)
    self.watchlists.map(&:tv_show_id).to_a.include?(tv_show.id)
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

  private
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

  def ensure_session_token
    self.session_token ||= SecureRandom.urlsafe_base64(16)
  end
end
