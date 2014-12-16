class Api::CurrentUserController < ApplicationController
  def show
    @user = User.includes(watchlists: :tv_show, favorites: :tv_show).
      find(current_user.id)
  end

  def tv_shows
    render json: current_user.tv_shows.order(:title)
  end

  def favorites
    favorite = current_user.favorites.find_or_initialize_by(
      tv_show_id: params[:current_user][:tv_show_id]
    )

    if favorite.persisted?
      favorite.destroy!
      render json: { destroyed: true }
    else
      favorite.save!
      render json: favorite
    end
  end

  def add_watchlist
    watchlist = current_user.watchlists.find_or_initialize_by(
      tv_show_id: watchlist_params[:tv_show_id]
    )

    if watchlist.update(watchlist_params)
      render json: {
        tv_show_id: watchlist.tv_show_id,
        status: watchlist.status
      }
    else
      render json: watchlist.errors.full_messages, status: 422
    end
  end

  def delete_watchlist
    watchlist = current_user.watchlists.find_by(
      tv_show_id: params[:tv_show_id]
    )

    watchlist.destroy!
    render json: { destroyed: true }
  end

  private
  def watchlist_params
    params.require(:current_user).permit(:tv_show_id, :status)
  end
end
