json.extract! @user, :id, :username

json.partial! @user, partial: 'api/users/user', as: :user