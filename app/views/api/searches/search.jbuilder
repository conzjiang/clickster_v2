json.tv_results @tv_results do |tv_show|
  json.extract! tv_show, :id, :title, :image_url, :rating, :blurb

  if signed_in?
    user = (@user || current_user)

    json.is_favorite user.likes?(tv_show)

    on_watchlist = user.listed?(tv_show)
    json.on_watchlist on_watchlist

    if on_watchlist
      json.watch_status(
        user.watchlists.find { |list| list.tv_show_id == tv_show.id }.status
      )
    end
  end
end

json.user_results @user_results do |user|
  json.extract! user, :id, :username, :image_url
  json.watch_count user.watch_count
  json.favorite_count user.favorite_count
end
