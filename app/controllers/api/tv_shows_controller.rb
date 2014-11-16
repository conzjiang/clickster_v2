class Api::TvShowsController < ApplicationController
  before_action :require_admin

  def create
    tv_show = TvShow.new(tv_params.merge(admin_id: current_user.id))

    if tv_show.save
      render json: tv_show, methods: :genres
    else
      render json: tv_show.errors.messages, status: 422
    end
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
