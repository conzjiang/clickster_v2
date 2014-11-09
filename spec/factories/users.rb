FactoryGirl.define do
  factory :user do
    email Faker::Internet.email
    username Faker::Internet.user_name
    password_digest SecureRandom.urlsafe_base64(16)
    session_token SecureRandom.urlsafe_base64(16)
  end
end
