json.extract! @user, :id, :username

json.watchlists @user.watchlists do |watchlist|
  json.tv_show_id watchlist.tv_show_id
  json.status watchlist.status
  json.title watchlist.tv_show.title
end

json.favorites @user.favorites do |fav|
  json.tv_show_id fav.tv_show_id
  json.title fav.tv_show.title
end