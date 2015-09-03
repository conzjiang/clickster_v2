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

json.watchers @tv_show.watchers do |watcher|
  json.extract! watcher, :id, :username, :image_url
  json.watch_status Watchlist.statuses_list[watcher.watch_status]
end

json.watching_idols_count @tv_show.watching_idols_count
