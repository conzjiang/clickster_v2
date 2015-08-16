class Api::CurrentUsersController < ApplicationController
  def feed
    @feed_items = FeedQuery.new(current_user, params[:last_fetched]).feed_items
  end

  def show
    unless signed_in?
      render json: "Not signed in."
    end
  end

  def update
    if params[:password].present?
      return if !validate_password
    end

    if current_user.update(user_params)
      render :show
    else
      errors = current_user.errors.messages

      if errors[:password]
        errors[:new_password] = errors[:password]
        errors.delete(:password)
      end

      render json: errors, status: 422
    end
  end

  private
  def user_params
    params.require(:current_user).permit(:email, :image_url)
  end

  def validate_password
    password = params[:password]
    new_password = params[:new_password]
    password_confirmation = params[:password_confirmation]

    return true unless new_password.present?

    if !current_user.is_password?(password)
      render json: {
        password: ["is incorrect."]
      }, status: 422
      return false
    end

    if new_password != password_confirmation
      render json: {
        password_confirmation: ["does not match."]
      }, status: 422
      return false
    end

    current_user.password = new_password
    true
  end
end
