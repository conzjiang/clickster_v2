FactoryGirl.define do
  factory :tv_decade do
    decade { rand(TvDecade.decades.length) }
    association :tv_show, factory: :tv_show
  end
end
