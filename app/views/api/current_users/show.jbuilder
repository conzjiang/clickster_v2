user = User.includes(
  watchlists: :tv_show,
  favorites: :tv_show
).find(current_user.id)

json.extract! user, :id, :username, :email, :is_admin, :image_url
json.tv_shows user.tv_shows if user.is_admin?
json.partial! user, partial: '/api/users/user', as: :user

tv_items = user.feed_items.
  where(subject_type: ["Watchlist", "Favorite"]).
  includes(subject: :tv_show)

user_items = user.feed_items.
  where(subject_type: "Follow").
  includes(subject: :idol)

json.feed(
  (tv_items + user_items).sort_by(&:created_at),
  partial: "api/current_users/feed_item",
  as: :item
)