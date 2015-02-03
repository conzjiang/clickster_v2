json.idol_name item.idol.username
json.subject_id item.subject_id
json.subject_type item.subject_type
json.subject_name(
  ["Watchlist", "Favorite"].include?(item.subject_type) ?
    item.subject.tv_show.title : item.subject.idol.username
)
json.message item.message
json.created_at item.created_at