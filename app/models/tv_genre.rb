class TvGenre < ActiveRecord::Base
  enum genre: %w(comedy drama live-action animated unscripted/reality scripted procedural serialized single-cam multi-cam action sci-fi/fantasy thriller period workplace family crime western medical)

  validates :tv_show_id, uniqueness: { scope: :genre }

  belongs_to :tv_show

  def self.genres_list
    self.genres.keys
  end

  def self.top_level_genres
    self.genres_list.first(10)
  end
end
