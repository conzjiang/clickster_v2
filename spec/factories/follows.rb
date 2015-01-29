FactoryGirl.define do
  factory :follow do
    association :follower, factory: :user
    association :idol, factory: :user
  end
end