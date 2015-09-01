json.tv_results @tv_results do |tv|
  json.partial! "api/tv_shows/tv_card", tv_show: tv, current_user: @user
end

json.user_results @user_results do |user|
  json.partial! "api/users/user", user: user
end
