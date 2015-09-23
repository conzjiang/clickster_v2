json.extract! @user, :username
json.image_url asset_path(@user.image.url(:profile))

json.watchlists @user.watchlist_shows_with_statuses do |tv|
  json.extract! tv, :id, :title
  json.image_url asset_path(tv.image.url(:mini))
  json.watch_status tv.watch_status
end

json.favorites @user.favorite_shows do |tv|
  json.extract! tv, :id, :title
  json.image_url asset_path(tv.image.url(:mini))
end

if !signed_in? || current_user == @user
  json.is_following false
else
  json.is_following current_user.following?(@user)
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
