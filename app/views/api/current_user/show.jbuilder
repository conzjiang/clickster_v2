json.extract! current_user, :id, :username, :is_admin

json.tv_shows current_user.tv_shows
json.watchlists current_user.watchlists do |watchlist|
  json.tv_show_id watchlist.tv_show_id
  json.status watchlist.status
end