class Api::CurrentUserController < ApplicationController
  def show
  end

  def tv_shows
    render json: current_user.tv_shows.order(:title)
  end

  def add_watchlist
    watchlist = current_user.watchlists.
      find_or_initialize_by(tv_show_id: watchlist_params[:tv_show_id])

    if watchlist.update(watchlist_params)
      render json: watchlist
    else
      render json: watchlist.errors.full_messages, status: 422
    end
  end

  private
  def watchlist_params
    params.require(:current_user).permit(:tv_show_id, :status)
  end
end
