json.extract! @user, :id, :username, :image_url
json.partial! @user, partial: 'api/users/user', as: :user