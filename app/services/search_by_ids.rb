class SearchByIds
  attr_reader :params

  def initialize(params)
    @params = params
  end

  def tv_results
    TvShow.find(tv_ids)
  end

  def user_results
    User.
      select(select_sql).
      joins(watchlists_join).
      joins(favorites_join).
      group("users.id").
      find(user_ids)
  end

  private
  def tv_ids
    params[:tv_ids] || []
  end

  def user_ids
    params[:user_ids] || []
  end

  def select_sql
    <<-SQL
      users.*,
      COUNT(DISTINCT watchlists.id) AS watch_count,
      COUNT(DISTINCT favorites.id) AS favorite_count
    SQL
  end

  def watchlists_join
    watching = Watchlist.where(status: "Watching")

    <<-SQL
      LEFT OUTER JOIN
        (#{watching.to_sql}) AS watchlists
      ON
        watchlists.watcher_id = users.id
    SQL
  end

  def favorites_join
    <<-SQL
      LEFT OUTER JOIN
        favorites
      ON
        favorites.favoriter_id = users.id
    SQL
  end
end
