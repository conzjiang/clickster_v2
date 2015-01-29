class Favorite < ActiveRecord::Base
  validates :favoriter_id, uniqueness: { scope: :tv_show_id }
  validates :tv_show, presence: true

  belongs_to :favoriter, class_name: "User"
  belongs_to :tv_show
end