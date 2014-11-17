class Api::TvShowsController < ApplicationController
  before_action :require_admin, only: [:create]

  def create
    tv_show = TvShow.new(tv_params.merge(admin_id: current_user.id))
    tv_show.set_decades

    if tv_show.save
      render json: tv_show, methods: :genres
    else
      render json: tv_show.errors.messages, status: 422
    end
  end

  def show
    @tv = TvShow.find(params[:id])
    render json: @tv, methods: :genres
  end

  private
  def tv_params
    params.require(:tv_show).permit(:title, :start_year, :end_year, :status, :imdb_id, :rating, :blurb, :num_seasons, :network, genres: [])
  end

  def require_admin
    unless current_user.admin?
      render json: ['You are not authorized to perform this action.'], status: 422
    end
  end
end
