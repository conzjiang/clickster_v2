class StaticPagesController < ApplicationController
  def root
    @genre_exceptions = GenreService::EXCEPTIONS
  end
end
