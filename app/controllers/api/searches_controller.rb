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
      results = results.where(status: [0, 1])
    end

    render json: results
  end

  def ids
    tv_ids = params[:tv_ids]
    user_ids = params[:user_ids]

    @tv_results = tv_ids ? TvShow.find(tv_ids) : []
    @user_results = user_ids ? User.
      includes(watchlists: :tv_show, favorites: :tv_show).
      find(user_ids) : []

    render :text
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
