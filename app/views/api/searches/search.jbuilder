json.tv_results @tv_results do |tv|
  json.partial! "api/tv_shows/tv_card", tv_show: tv, current_user: @user
end

json.user_results @user_results do |user|
  json.extract! user, :id, :username, :image_url
  json.watch_count user.watch_count
  json.favorite_count user.favorite_count
end
