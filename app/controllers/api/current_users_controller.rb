class Api::CurrentUsersController < ApplicationController
  NUM_ITEMS_TO_DISPLAY = 3

  wrap_parameters false
  before_action :validate_password, only: :update

  def feed
    @feed_items = FeedQuery.new(
        current_user,
        params[:last_fetched]
      ).feed_items.limit(NUM_ITEMS_TO_DISPLAY).to_a

    if @feed_items.empty?
      @recommendations = User.recently_active(NUM_ITEMS_TO_DISPLAY)
    end
  end

  def show
    unless signed_in?
      render json: "Not signed in."
    end
  end

  def update
    if current_user.update(user_params)
      render :show
    else
      errors = current_user.errors.messages
      errors[:new_password] = errors.delete(:password) if errors[:password]

      render json: errors, status: 422
    end
  end

  private
  def user_params
    params.require(:current_user).permit(:email, :image_url)
  end

  def validate_password
    return if password_params.blank?
    password = ValidatePassword.new(current_user, password_params).go
    render json: password.error, status: 422 if !password.valid?
  end

  def password_params
    params.require(:current_user).permit(
      :password,
      :new_password,
      :password_confirmation
    )
  end
end
