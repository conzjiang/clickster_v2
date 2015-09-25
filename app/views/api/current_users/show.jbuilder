json.extract! current_user, :username, :email, :is_admin, :slug
json.image_url asset_path(current_user.image.url(:thumb))
json.profile_size_image_url asset_path(current_user.image.url(:profile))
json.isDemoUser current_user.demo_user?
