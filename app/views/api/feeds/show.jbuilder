json.new_items @feed_items, partial: "api/feeds/feed_item", as: :item

if @recommendations
  json.recommendations @recommendations do |user|
    json.extract! user, :id, :username
    json.image_url asset_path(user.image_url)
  end

  json.has_idols current_user.follows.count > 0
end
