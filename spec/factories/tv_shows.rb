FactoryGirl.define do
  factory :tv_show do
    title { Faker::Company.name }

    # attributes needed for required image
    image_file_name 'blank.jpg'
    image_content_type 'image/jpg'
    image_file_size 1

    association :admin, factory: :user

    transient do
      with_genres false
      with_decades false
    end

    after(:build) do |tv_show, eval|
      eval.with_genres.try(:each) do |genre|
        tv_show.tv_genres.new(genre: genre)
      end

      eval.with_decades.try(:each) do |decade|
        tv_show.tv_decades.new(decade: decade)
      end
    end
  end
end
