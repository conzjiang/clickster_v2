class FeedQuery
  attr_reader :user, :last_fetched

  def initialize(user, last_fetched = nil)
    @user = user
    @last_fetched = last_fetched.to_datetime if last_fetched
  end

  def feed_items
    @feed_items ||= FeedItem.
      select(select_sql).
      from("(#{recent_feed_items.to_sql}) AS feed_items").
      joins(:user).
      joins(left_outer_join_watchlists).
      joins(left_outer_join_favorites).
      joins(left_outer_join_follows).
      order(created_at: :desc)
  end

  def recent_feed_items
    return @recent_feed_items if @recent_feed_items

    feed_items = FeedItem.where(user_id: user.id)

    if last_fetched
      feed_items = feed_items.where("created_at > ?", last_fetched + 1.second)
    end

    @recent_feed_items = feed_items
  end

  private

  def select_sql
    <<-SQL
      feed_items.*,
      users.username AS idol_name,
      CASE
        WHEN watchlists.id IS NOT NULL
          THEN watchlists.tv_show_title
        WHEN favorites.id IS NOT NULL
          THEN favorites.tv_show_title
        WHEN follows.id IS NOT NULL
          THEN follows.idol_name
      END AS subject_name
    SQL
  end

  def left_outer_join_watchlists
    watchlists = Watchlist.
      select("watchlists.*, tv_shows.title AS tv_show_title").
      joins(:tv_show)

    <<-SQL
      LEFT OUTER JOIN
        (#{watchlists.to_sql}) AS watchlists
      ON
        watchlists.id = feed_items.subject_id
        AND feed_items.subject_type = 'Watchlist'
    SQL
  end

  def left_outer_join_favorites
    favorites = Favorite.
      select("favorites.*, tv_shows.title AS tv_show_title").
      joins(:tv_show)

    <<-SQL
      LEFT OUTER JOIN
        (#{favorites.to_sql}) AS favorites
      ON
        favorites.id = feed_items.subject_id
        AND feed_items.subject_type = 'Favorite'
    SQL
  end

  def left_outer_join_follows
    follows = Follow.
      select("follows.*, users.username AS idol_name").
      joins(:idol)

    <<-SQL
    LEFT OUTER JOIN
      (#{follows.to_sql}) AS follows
    ON
      follows.id = feed_items.subject_id
      AND feed_items.subject_type = 'Follow'
    SQL
  end
end