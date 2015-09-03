class TvShowInfo
  attr_reader :tv_show, :current_user_id

  def initialize(tv_show, current_user_id)
    @tv_show = tv_show
    @current_user_id = current_user_id
  end

  def method_missing(name, *args, &blk)
    if tv_show.respond_to?(name)
      tv_show.send(name, *args, &blk)
    else
      super
    end
  end

  def watchers
    return nil unless signed_in?
    return @watchers if @watchers

    @watchers = tv_show.watchers.
      select("users.*, watchlists.status AS watch_status").
      sort_by do |watcher|

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

  def watching_idols_count
    @watching_idols_count ||= 0
  end

  protected
  attr_writer :watching_idols_count

  private
  def current_user
    return nil unless signed_in?
    @current_user ||= User.includes(:follows).find(current_user_id)
  end

  def signed_in?
    !!current_user_id
  end
end
