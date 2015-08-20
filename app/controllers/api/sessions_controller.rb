class Api::SessionsController < ApplicationController
  def create
    @user = User.find_by_credentials(
      params[:user][:identifier],
      params[:user][:password]
    )

    if @user
      sign_in!(@user)
      render 'users/show'
    else
      render json: ['Incorrect username/password'], status: 422
    end
  end

  def demo
    @user = CreateDemoUser.go!
    sign_in!(@user)
    render 'users/show'
  end

  def facebook
    @user = User.find_or_create_by_omniauth_params(params[:facebook])
    sign_in!(@user)
    render 'users/show'
  end
end
