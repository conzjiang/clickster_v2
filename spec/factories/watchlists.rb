FactoryGirl.define do
  factory :watchlist do
    status { rand(Watchlist.statuses.length) }
    association :tv_show, factory: :tv_show
    association :watcher, factory: :user
  end
end