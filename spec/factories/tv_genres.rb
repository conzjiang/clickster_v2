FactoryGirl.define do
  factory :tv_genre do
    genre { rand(TvGenre.genres.length) }
    association :tv_show, factory: :tv_show
  end
end