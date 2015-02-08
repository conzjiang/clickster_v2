FactoryGirl.define do
  factory :tv_show do
    title { Faker::Company.name }
    image_url { Faker::Internet.url }
    association :admin, factory: :user
  end
end
