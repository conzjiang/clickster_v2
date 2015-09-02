json.extract! current_user, :username, :email, :is_admin
json.image_url asset_path(current_user.image_url)
json.isDemoUser current_user.demo_user?
