FactoryGirl.define do
  factory :user do
    email { Faker::Internet.email }
    username { Faker::Internet.user_name(3..User::MAX_USERNAME_LENGTH) }
    password { Faker::Internet.password(6) }

    factory :admin do
      is_admin true
    end
  end
end
