json.extract! @user, :id, :username, :email, :is_admin

json.tv_shows @user.tv_shows

json.partial! @user, partial: '/api/users/user', as: :user