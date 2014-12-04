class Api::TvShowsController < ApplicationController
  before_action :require_admin, only: [:create, :update]

  def create
    tv_show = TvShow.includes(:tv_decades).
      new(tv_params.merge(admin_id: current_user.id))
    tv_show.set_decades

    if tv_show.save
      render json: tv_show, methods: :genres
    else
      render json: tv_show.errors.messages, status: 422
    end
  end

  def show
    tv_show = TvShow.find(params[:id])
    render json: tv_show, methods: :genres
  end

  def update
    tv_show = TvShow.find(params[:id])
    tv_show.assign_attributes(tv_params)

    unless (tv_show.changed & ["start_year", "end_year"]).empty?
      tv_show.set_decades
    end

    if tv_show.update(tv_params)
      render json: tv_show, methods: :genres
    else
      render json: tv_show.errors.full_messages, status: 422
    end
  end

  private
  def tv_params
    params.require(:tv_show).permit(
      :title, :start_year, :end_year, :status, :imdb_id, :rating, :blurb,
      :num_seasons, :network, genres: []
    )
  end

  def require_admin
    unless current_user.admin?
      render json: ['You are not authorized to perform this action.'],
        status: 422
    end
  end
end
