class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  helper_method :current_user, :signed_in?

  def current_user
    @current_user ||= User.find_by(session_token: session[:token])
  end

  def require_signed_in
    unless signed_in?
      flash[:notice] = "You must be signed in to perform this action!"
      redirect_to new_session_url
    end
  end

  def sign_in(user)
    session[:token] = user.reset_session_token!
  end

  def sign_out
    session[:token] = nil
  end

  def signed_in?
    !!current_user
  end
end
