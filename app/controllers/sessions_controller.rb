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
      flash[:errors] = ["Incorrect username/password combination"]
      render :new
    end
  end
end
