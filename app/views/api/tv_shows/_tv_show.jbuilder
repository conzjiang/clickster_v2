if signed_in?
  user ||= current_user

  json.is_favorite user.likes?(tv_show)

  on_watchlist = user.listed?(tv_show)
  json.on_watchlist on_watchlist

  if on_watchlist
    json.watch_status(
      user.watchlists.find { |list| list.tv_show_id == tv_show.id }.status
    )
  end
end
