class Api::TvShowsController < ApplicationController
  before_action :require_admin, only: [:create, :update]

  def index
    @tv_shows = TvShow.where(status: "Currently Airing")
  end

  def create
    @tv_show = current_user.tv_shows.includes(:tv_decades).new(tv_params)

    if @tv_show.save
      render :show
    else
      render json: tv_show.errors.messages, status: 422
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
    @tv_show = TvShow.find(params[:id])

    if @tv_show.update(tv_params)
      render :show
    else
      render json: @tv_show.errors.full_messages, status: 422
    end
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

  def tv_params
    params.require(:tv_show).permit(
      :title, :start_year, :end_year, :status, :imdb_id, :rating, :blurb,
      :num_seasons, :network, :image_url, genres: []
    )
  end
end