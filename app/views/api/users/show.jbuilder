json.extract! @user, :username, :image_url

json.watchlists @user.watchlist_shows_with_statuses do |tv|
  json.extract! tv, :id, :title, :image_url
  json.watch_status tv.watch_status
end

json.favorites @user.favorite_shows do |tv|
  json.extract! tv, :id, :title, :image_url
end

json.is_following do
  if !signed_in? || current_user == @user
    false
  else
    current_user.following?(@user)
  end
end

json.is_current_user current_user == @user
json.watch_count @user.watch_count
json.favorite_count @user.favorite_count

json.followers @user.followers.with_watch_and_favorite_count do |follower|
  json.partial! "api/users/user", user: follower
end

json.idols @user.idols.with_watch_and_favorite_count do |idol|
  json.partial! "api/users/user", user: idol
end

if @user.created_at > 1.minute.ago
  json.facebook true
end
