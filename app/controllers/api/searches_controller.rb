class Api::SearchesController < ApplicationController
  def get
    results = TvShow

    if decade_params
      decade_ids = TvDecade.get_ids(decade_params)
      results = results.decade_search(decade_ids)
    end

    if genre_params
      genre_ids = TvGenre.get_ids(genre_params)
      results = results.genre_search(genre_ids)
    end

    if status
      results = results.where(status: status)
    end

    render json: results
  end

  private
  def decade_params
    params.require(:query).permit(decades: [])[:decades]
  end

  def genre_params
    params.require(:query).permit(genres: [])[:genres]
  end

  def status
    params.require(:query).permit(:status)[:status]
  end
end
