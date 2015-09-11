json.new_items @feed_items, partial: "api/current_users/feed_item", as: :item

json.recommendations @recommendations do |user|
  json.extract! user, :id, :username
  json.image_url asset_path(user.image_url)
end

json.has_idols current_user.follows.count > 0 if @recommendations
