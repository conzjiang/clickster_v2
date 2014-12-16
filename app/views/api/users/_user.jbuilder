json.watchlists user.watchlists,
  partial: 'api/watchlists/watchlist', as: :watchlist

json.favorites user.favorites do |fav|
  json.tv_show_id fav.tv_show_id
  json.title fav.tv_show.title
end