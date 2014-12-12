class Api::UsersController < ApplicationController
  def create
    user = User.new(user_params)

    if user.save
      sign_in(user)
      render json: { newUser: true, username: user.username }, status: 200
    else
      render json: user.errors.full_messages, status: 422
    end
  end

  def show
    @user = User.find_by_username(params[:username])

    if @user
      render :show
    else
      render json: "User not found", status: 404
    end
  end

  private
  def user_params
    params.require(:user).permit(:email, :username, :password)
  end
end
