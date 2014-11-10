class TvShow < ActiveRecord::Base
  validates :title, presence: true

  belongs_to :admin, class_name: "User"
  has_many :tv_decades
end
