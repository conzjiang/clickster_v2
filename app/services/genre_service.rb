class GenreService
  EXCEPTIONS = {
    "live-action" => "Live-Action",
    "unscripted-reality" => "Unscripted/Reality",
    "single-cam" => "Single-cam",
    "multi-cam" => "Multi-cam",
    "sci-fi-fantasy" => "Sci-Fi/Fantasy"
  }

  attr_reader :genre_string

  def self.dehyphenate(genre_string)
    genre_string.gsub(/-/, " ").capitalize
  end

  def initialize(genre_string)
    @genre_string = genre_string
  end

  def exception?
    EXCEPTIONS.has_key?(genre_string)
  end

  def process
    if exception?
      EXCEPTIONS[genre_string]
    else
      GenreService.dehyphenate(genre_string)
    end
  end
end