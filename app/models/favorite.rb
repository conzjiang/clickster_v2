class Favorite < ActiveRecord::Base
  validates :favoriter, uniqueness: { scope: :tv_show }

  belongs_to :favoriter, class_name: "User"
  belongs_to :tv_show
end