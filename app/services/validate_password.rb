class ValidatePassword
  attr_reader :current_user, :params
  attr_accessor :error

  def initialize(current_user, params)
    @current_user = current_user
    @params = params
  end

  def go
    set_password if check_password && confirm_new_password
    self
  end

  def valid?
    error.nil?
  end

  def check_password
    return true if current_user.is_password?(params[:password])
    self.error = { password: ["is incorrect."] }
    false
  end

  def confirm_new_password
    return true if params[:new_password] == params[:password_confirmation]
    self.error = { password_confirmation: ["does not match."] }
    false
  end

  def set_password
    current_user.password = params[:new_password]
  end
end
