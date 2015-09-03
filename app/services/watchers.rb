class Watchers
  attr_reader :params

  def initialize(params)
    @params = params
  end

  def watchers
    return @watchers if @watchers

    @watchers = tv_show.watchers.where({
      watchlists: {
        status: Watchlist.statuses[params[:status]]
      }
    })

    sort_watchers! if signed_in?
    @watchers
  end

  def watching_idols_count
    @watching_idols_count ||= 0
  end

  protected
  attr_writer :watching_idols_count

  private
  def current_user
    return nil unless signed_in?
    @current_user ||= User.includes(:follows).find(params[:current_user_id])
  end

  def signed_in?
    !!params[:current_user_id]
  end

  def sort_watchers!
    @watchers = @watchers.sort_by do |watcher|
      if current_user == watcher
        0
      elsif current_user.following?(watcher)
        self.watching_idols_count += 1
        1
      else
        2
      end
    end
  end

  def tv_show
    @tv_show ||= TvShow.find(params[:id])
  end
end
