class TvShow < ActiveRecord::Base
  enum status: ['Currently Airing', 'Current', 'Ended', 'Cancelled']

  validates :title, presence: true

  belongs_to :admin, class_name: "User"
  has_many :tv_decades
  has_many :tv_genres

  def self.statuses_list
    self.statuses.keys
  end
end
