class SessionsController < ApplicationController
  def new
    @user = User.new
  end

  def create
    @user = User.find_by_credentials(
      params[:user][:identifier],
      params[:user][:password]
    )

    if @user
      sign_in(@user)
      flash[:notice] = "Successfully signed in!"
      redirect_to root_url
    else
      @user = User.new(user_params)
      flash.now[:errors] = ["Incorrect username/password combination"]
      render :new
    end
  end

  def destroy
    sign_out
    flash[:notice] = "Successfully signed out!"
    redirect_to root_url
  end

  private
  def user_params
    params[:user][:username] = params[:user][:identifier]
    params[:user].delete(:identifier)

    params.require(:user).permit(:username, :email, :password)
  end
end
