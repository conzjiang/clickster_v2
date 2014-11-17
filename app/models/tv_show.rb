class TvShow < ActiveRecord::Base
  enum status: ['Currently Airing', 'Current', 'Ended', 'Cancelled']

  validates :title, presence: true
  validates :imdb_id, allow_nil: true, uniqueness: {
    message: "Series already exists in the database"
  }
  validates :start_year, :end_year, numericality: true, allow_nil: true
  validate :valid_years

  belongs_to :admin, class_name: "User"
  has_many :tv_decades
  has_many :tv_genres

  def self.statuses_list
    self.statuses.keys
  end

  def genres=(tv_genres)
    tv_genres.each do |genre|
      self.tv_genres.new(genre: genre)
    end
  end

  def genres
    self.tv_genres.map(&:genre)
  end

  private
  def valid_years
    if self.start_year && !self.start_year.between?(1900, Date.current.year)
      errors[:start_year] << 'is invalid'
    end

    if self.end_year && self.start_year.nil?
      errors[:end_year] << 'is invalid without start year'
    end

    if self.end_year && self.start_year.try(:>, self.end_year)
      errors[:end_year] << 'cannot be before start year'
    end

    if self.end_year && self.status =~ /Current/
      errors[:status] << 'cannot be Current if series has ended'
    end
  end
end
