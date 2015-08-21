json.extract! @user, :id, :username, :image_url
json.partial! @user, partial: 'api/users/user', as: :user

if @user.created_at > 1.minute.ago
  json.facebook true
end
