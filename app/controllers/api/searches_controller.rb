class Api::SearchesController < ApplicationController
  def by_genre_and_decade
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

    render json: { tv_results: results }
  end

  def by_ids
    tv_ids = params[:tv_ids] || []
    user_ids = params[:user_ids] || []
    watching = Watchlist.where(status: "Watching")

    @tv_results = TvShow.find(tv_ids)
    @user_results = User.
      select("users.*, COUNT(DISTINCT watchlists.id) AS watch_count, COUNT(DISTINCT favorites.id) AS favorite_count").
      joins("LEFT OUTER JOIN (#{watching.to_sql}) AS watchlists ON watchlists.watcher_id = users.id").
      joins("LEFT OUTER JOIN favorites ON favorites.favoriter_id = users.id").
      group("users.id").
      find(user_ids)

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
