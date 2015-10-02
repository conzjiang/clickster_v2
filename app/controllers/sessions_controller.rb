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
      sign_in!(@user)
      flash[:notice] = "Successfully signed in!"
      redirect_to root_url
    else
      @user = User.new(user_params)
      flash.now[:errors] = ["Incorrect username/password combination"]
      render :new
    end
  end

  def destroy
    sign_out!
    flash[:notice] = "Successfully signed out!"
    redirect_to root_url
  end

  def facebook
    user = User.find_by_omniauth_params(omniauth_hash)

    if user
      sign_in!(user)
      redirect_to root_url
    else
      user = User.create_from_omniauth_params!(omniauth_hash)
      sign_in!(user)
      redirect_to "#{root_url}#facebook"
    end
  end

  private
  def omniauth_hash
    req_hash = request.env['omniauth.auth']

    {
      uid: req_hash[:uid],
      email: req_hash[:info][:email],
      name: req_hash[:info][:name]
    }
  end

  def user_params
    params[:user][:username] = params[:user][:identifier]
    params[:user].delete(:identifier)

    params.require(:user).permit(:username, :email, :password)
  end
end
