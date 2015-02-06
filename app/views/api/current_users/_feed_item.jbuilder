json.idol_name item.idol.username
json.subject_type item.subject_type
json.message item.message
json.created_at item.created_at

case item.subject_type
when "Watchlist", "Favorite"
  json.subject_id item.subject.tv_show.id
  json.subject_name item.subject.tv_show.title
when "Follow"
  json.subject_id item.subject_id
  json.subject_name item.subject.idol.username
end
