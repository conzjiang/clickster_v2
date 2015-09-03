json.watchers @tv_show.watchers do |watcher|
  json.extract! watcher, :id, :username, :image_url
end

json.watching_idols_count @tv_show.watching_idols_count