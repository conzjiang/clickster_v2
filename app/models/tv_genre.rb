class TvGenre < ActiveRecord::Base
  enum genre: %w(comedy drama live-action animated unscripted/reality scripted procedural serialized single-cam multi-cam action sci-fi/fantasy thriller period workplace family crime western medical)

  validates :tv_show_id, uniqueness: { scope: :genre }

  belongs_to :tv_show
end
