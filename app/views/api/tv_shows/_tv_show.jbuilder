json.extract! tv_show, :id, :title, :start_year, :end_year, :status, :imdb_id, :rating, :blurb, :num_seasons, :network, :image_url

json.genres tv_show.genres

if signed_in?
  user = (@user || current_user)

  json.is_favorite current_user.likes?(tv_show)

  on_watchlist = current_user.listed?(tv_show)
  json.on_watchlist on_watchlist

  if on_watchlist
    json.watch_status(
      current_user.watchlists.find_by(tv_show_id: tv_show.id).status
    )
  end
end