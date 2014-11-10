class Api::SessionsController < ApplicationController
  def create
    user = User.find_by_credentials(
      params[:user][:identifier],
      params[:user][:password]
    )

    if user
      sign_in(user)
      render json: user, status: 200
    else
      render json: ['Incorrect username/password'], status: 422
    end
  end
end
