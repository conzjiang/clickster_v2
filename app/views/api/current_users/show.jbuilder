user = User.includes(watchlists: :tv_show, favorites: :tv_show).
  find(current_user.id)

json.extract! user, :id, :username, :email, :is_admin, :image_url
json.tv_shows user.tv_shows
json.partial! user, partial: '/api/users/user', as: :user