FactoryGirl.define do
  factory :tv_show do
    title { Faker::Company.name }
    association :admin, factory: :user
  end
end
