class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def sign_in(user)
    session[:token] = user.reset_session_token!
  end
end
