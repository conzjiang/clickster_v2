json.extract! tv_show, :id, :title, :rating, :blurb
json.image_url asset_path(tv_show.image.url(:result))
json.partial! "api/tv_shows/tv_show", tv_show: tv_show