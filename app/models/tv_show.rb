class TvShow < ActiveRecord::Base
  validates :title, presence: true

  belongs_to :admin, class_name: "User"
end
