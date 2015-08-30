json.watchlists user.watchlist_shows do |tv|
  json.extract! tv, :id, :title
end

json.favorites user.favorite_shows do |tv|
  json.extract! tv, :id, :title
end

json.is_following do
  if !signed_in? || current_user == user
    false
  else
    current_user.following?(user)
  end
end

json.is_current_user current_user == user
