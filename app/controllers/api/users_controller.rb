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

  def username
    if User.exists?(username: params[:username])
      render json: {}, status: 422
    else
      head :no_content
    end
  end

  def show
    @user = User.includes(watchlists: :tv_show, favorites: :tv_show)
                .find_by_username(params[:username])

    if @user
      render :show
    else
      render json: "User not found", status: 404
    end
  end

  def follow
    user = User.find_by(username: params[:username])
    follow = current_user.follows.find_or_initialize_by(idol_id: user.id)

    if follow.persisted?
      follow.destroy!
      is_following = false
    else
      follow.save!
      is_following = true
    end

    render json: { is_following: is_following }
  end

  private
  def user_params
    params.require(:user).permit(:email, :username, :password, :image_url)
  end
end
