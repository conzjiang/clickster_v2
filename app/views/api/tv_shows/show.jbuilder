json.extract!(
  @tv_show,
  :id,
  :title,
  :start_year,
  :end_year,
  :status,
  :imdb_id,
  :rating,
  :blurb,
  :num_seasons,
  :network,
  :image_url
)

json.partial! "api/tv_shows/tv_show", tv_show: @tv_show
json.genres @tv_show.genres
json.belongs_to_admin current_user.admins?(@tv_show)
