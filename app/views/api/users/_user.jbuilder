json.watchlists user.watchlists, partial: 'api/lists/watchlist', as: :watchlist
json.favorites user.favorites, partial: 'api/lists/favorite', as: :favorite

json.is_following current_user.following?(user)
json.is_current_user current_user == user
