json.extract! current_user, :id, :username, :is_admin

json.tv_shows current_user.tv_shows

json.watchlists current_user.watchlists do |watchlist|
  json.tv_show_id watchlist.tv_show_id
  json.status watchlist.status
  json.title watchlist.tv_show.title
end

json.favorites current_user.favorites do |fav|
  json.tv_show_id fav.tv_show_id
  json.title fav.tv_show.title
end