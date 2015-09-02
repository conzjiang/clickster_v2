json.extract! tv_show, :id, :title, :image_url, :rating, :blurb
json.partial! "api/tv_shows/tv_show", tv_show: tv_show