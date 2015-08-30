class TvGenre < ActiveRecord::Base
  enum genre: %w(Comedy Drama Live-Action Animated Scripted Unscripted/Reality Serialized Procedural Single-cam Multi-cam Action Sci-Fi/Fantasy Thriller Period Workplace Family Crime Western Medical Romance)

  validates :tv_show_id, uniqueness: { scope: :genre }

  belongs_to :tv_show

  def self.genres_list
    genres.keys
  end

  def self.top_level_genres
    genres_list.first(10)
  end

  def self.get_ids(genre_names)
    genres.values_at(*genre_names).compact
  end
end
