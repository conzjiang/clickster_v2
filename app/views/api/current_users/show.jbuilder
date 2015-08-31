json.extract! current_user, :username, :image_url, :email, :is_admin
json.isDemoUser current_user.demo_user?
