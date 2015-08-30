json.extract! tv_show, :id, :title, :image_url, :rating, :blurb

if signed_in?
  json.is_favorite current_user.likes?(tv_show)

  on_watchlist = current_user.listed?(tv_show)
  json.on_watchlist on_watchlist

  if on_watchlist
    json.watch_status(
      current_user.watchlists.find do |list|
        list.tv_show_id == tv_show.id }.status
      end
    )
  end
end