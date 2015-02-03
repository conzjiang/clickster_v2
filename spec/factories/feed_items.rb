FactoryGirl.define do
  factory :feed_item do
    message { Faker::Lorem.word }

    association :user, factory: :user
    association :idol, factory: :user

    subject_factory = [:favorite, :watchlist, :follow].sample
    association :subject, factory: subject_factory
  end
end