FactoryGirl.define do
  factory :favorite do
    association :favoriter, factory: :user
    association :tv_show, factory: :tv_show
  end
end