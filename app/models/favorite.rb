class Favorite < ActiveRecord::Base
  validates :favoriter, uniqueness: { scope: :tv_show }
  validates :tv_show, presence: true

  belongs_to :favoriter, class_name: "User"
  belongs_to :tv_show
end