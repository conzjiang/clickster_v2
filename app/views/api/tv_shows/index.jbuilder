json.array! @tv_shows do |tv|
  json.extract! tv, :id, :title, :image_url, :blurb, :rating, :status
  json.partial! 'api/tv_shows/tv_show', tv_show: tv
end
