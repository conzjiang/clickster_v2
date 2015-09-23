json.array! @tv_shows do |tv|
  json.extract! tv, :id, :title, :blurb, :rating, :status
  json.image_url asset_path(tv.image.url(:mini))
  json.partial! 'api/tv_shows/tv_show', tv_show: tv
end
