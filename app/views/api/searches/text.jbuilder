json.tv_results @tv_results, partial: "api/tv_shows/tv_show", as: :tv_show
json.user_results @user_results do |user|
  json.extract! user, :id, :username, :image_url
  json.partial! user, partial: "api/users/user", as: :user
end