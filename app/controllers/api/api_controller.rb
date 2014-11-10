class Api::ApiController < ApplicationController
  def current
    render json: current_user
  end
end
