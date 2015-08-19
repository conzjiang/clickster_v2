class TvShow < ActiveRecord::Base
  enum status: ['Currently Airing', 'Current', 'Ended', 'Cancelled']

  validates :title, :image_url, presence: true
  validates :imdb_id, allow_nil: true, uniqueness: {
    message: "Series already exists in the database"
  }
  validates :start_year, :end_year, numericality: true, allow_nil: true
  validate :valid_years

  belongs_to :admin, class_name: "User"
  has_many :tv_decades, dependent: :destroy
  has_many :tv_genres, dependent: :destroy
  has_many :watchlists, dependent: :destroy
  has_many :favorites, dependent: :destroy
  has_many :favoriters, through: :favorites

  before_save :set_decades

  scope :decade_search, -> (decade_ids) do
    joins(:tv_decades).where("tv_decades.decade IN (#{decade_ids.join(',')})")
  end

  scope :genre_search, -> (genre_ids) do
    joins(:tv_genres).where("tv_genres.genre IN (#{genre_ids.join(',')})")
  end

  def self.by_genre(genre)
    # raw sql so that `includes` can add another self join
    joins("JOIN tv_genres AS genres ON genres.tv_show_id = tv_shows.id").
      where("genres.genre = ?", TvGenre.genres[genre])
  end

  def self.statuses_list
    self.statuses.keys
  end

  def decades(reload = false)
    self.tv_decades(reload).map(&:decade).
      sort_by { |decade| TvDecade.decades_list.index(decade) }
  end

  def genres=(new_genres)
    old_genres = (self.genres - new_genres).map do |genre|
      TvGenre.genres[genre]
    end

    unless old_genres.empty?
      self.tv_genres.where(genre: old_genres).destroy_all
    end

    new_genres.each do |genre|
      next if self.genres.include?(genre)
      self.tv_genres.new(genre: genre)
    end
  end

  def genres(reload = false)
    self.tv_genres(reload).map(&:genre)
  end

  private
  def decade_range
    decade_range = [self.start_year, self.end_year || Date.current.year]

    decades = ((decade_range.first..decade_range.last).to_a.select do |year|
      year % 10 == 0
    end + [self.start_year]).uniq

    decades.map do |decade|
      year = ((decade % 100) - (decade % 10)).to_s
      year.length == 2 ? year : year + "0"
    end
  end

  def set_decades
    if self.start_year.present?
      old_decades = (self.decades - decade_range).map do |decade|
        TvDecade.decades[decade]
      end

      unless old_decades.empty?
        self.tv_decades.where(decade: old_decades).destroy_all
      end

      decade_range.each do |decade|
        next if self.decades.include?(decade)
        self.tv_decades.new(decade: decade)
      end
    end
  end

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
