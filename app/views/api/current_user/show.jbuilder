json.extract! @user, :id, :username, :is_admin

json.tv_shows @user.tv_shows

json.partial! @user, partial: '/api/users/user', as: :user