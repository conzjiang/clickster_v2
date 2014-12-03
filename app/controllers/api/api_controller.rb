class Api::ApiController < ApplicationController
  def current
    render json: current_user
  end

  def current_tv
    render json: current_user.tv_shows.order(:title)
  end
end
