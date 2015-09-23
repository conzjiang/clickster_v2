json.extract! user, :id, :username
json.image_url asset_path(user.image.url(:profile))
json.watch_count user.watch_count
json.favorite_count user.favorite_count