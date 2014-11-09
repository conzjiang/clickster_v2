class UsersController < ApplicationController
  before_action :require_signed_in, only: [:edit, :update]
  before_action :require_correct_user, only: [:destroy]

  def index
    @users = User.all
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)

    if @user.save
      sign_in(@user)
      flash[:notice] = "Successfully signed up!"
      redirect_to root_url
    else
      flash.now[:errors] = @user.errors.full_messages
      render :new
    end
  end

  def show
    @user = User.find(params[:id])
  end

  def edit
    @user = current_user
  end

  def update
    @user = current_user

    if @user.update(user_params)
      flash[:notice] = "Successfully updated profile!"
      redirect_to @user
    else
      flash.now[:errors] = @user.errors.full_messages
      render :edit
    end
  end

  private
  def require_correct_user
    unless signed_in? && current_user.id == params[:id]
      flash[:errors] = ["You are not authorized to perform this action."]
      redirect_to root_url
    end
  end

  def user_params
    params.require(:user).permit(:email, :username, :password)
  end
end
