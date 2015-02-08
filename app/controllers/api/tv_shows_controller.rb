class Api::TvShowsController < ApplicationController
  before_action :require_admin, only: [:create, :update]
  before_action :require_sign_in, only: [:favorite, :watchlist]

  def index
    @tv_shows = TvShow.includes(:tv_genres).where(status: "Currently Airing")

    if signed_in?
      @user = User.
        includes(:watchlists, :favorites).
        find(current_user.id)
    end
  end

  def create
    @tv_show = current_user.tv_shows.includes(:tv_decades).new(tv_params)

    if @tv_show.save
      render :show
    else
      render json: @tv_show.errors.messages, status: 422
    end
  end

  def genre
    genre = process_genre(params[:genre])
    @tv_shows = TvShow.by_genre(genre).includes(:tv_genres)
    render :index
  end

  def show
    @tv_show = TvShow.find(params[:id])
  end

  def update
    @tv_show = TvShow.includes(:tv_decades).find(params[:id])

    if @tv_show.update(tv_params)
      render :show
    else
      render json: @tv_show.errors.full_messages, status: 422
    end
  end

  def favorite
    favorite = current_user.favorites.
      find_or_initialize_by(tv_show_id: params[:id])

    if favorite.persisted?
      favorite.destroy!
      is_favorite = false
    else
      favorite.save!
      is_favorite = true
    end

    render json: { is_favorite: is_favorite }
  end

  def watchlist
    list = current_user.watchlists.
      find_or_initialize_by(tv_show_id: params[:id])

    if list.status == params[:status]
      list.destroy!
      on_watchlist = false
      status = nil
    else
      list.update!(status: params[:status])
      on_watchlist = true
      status = list.status
    end

    render json: { on_watchlist: on_watchlist, watch_status: status }
  end

  private
  def process_genre(genre)
    GenreService.new(genre).process
  end

  def require_admin
    unless signed_in? && current_user.is_admin?
      render json: ['You are not authorized to perform this action.'],
        status: 422
    end
  end

  def require_sign_in
    unless signed_in?
      render json: ["Please sign in first!"], status: 422
    end
  end

  def tv_params
    params.require(:tv_show).permit(
      :title, :start_year, :end_year, :status, :imdb_id, :rating, :blurb,
      :num_seasons, :network, :image_url, genres: []
    )
  end
end