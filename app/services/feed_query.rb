class FeedQuery
  attr_reader :user, :last_fetched

  def initialize(user, last_fetched = nil)
    @user = user
    @last_fetched = last_fetched.to_datetime if last_fetched
  end

  def feed_items
    return @recent_feed_items if @recent_feed_items

    @recent_feed_items = _all_feed_items

    if last_fetched
      @recent_feed_items = _all_feed_items.where(created_after_last_fetched, {
        last_fetched: last_fetched + 1.second
      })
    end

    @recent_feed_items
  end

  private
  def created_after_last_fetched
    <<-SQL
      watchlists.created_at > :last_fetched
        OR favorites.created_at > :last_fetched
        OR follows.created_at > :last_fetched
    SQL
  end

  def _all_feed_items
    @feed_items ||= FeedItem.
      select(select_sql).
      from("(#{FeedItem.where(user_id: user.id).to_sql}) AS feed_items").
      joins(:idol).
      joins(left_outer_join_watchlists).
      joins(left_outer_join_favorites).
      joins(left_outer_join_follows).
      order("subject_created_at DESC")
  end

  def select_sql
    <<-SQL
      feed_items.*,
      idols_feed_items.username AS idol_name,
      (#{subject_name}) AS subject_name,
      (#{subject_id}) AS subject_id,
      (#{created_at}) AS subject_created_at
    SQL
  end

  def subject_name
    <<-SQL
      CASE
        WHEN watchlists.id IS NOT NULL
          THEN watchlists.tv_show_title
        WHEN favorites.id IS NOT NULL
          THEN favorites.tv_show_title
        WHEN follows.id IS NOT NULL
          THEN follows.idol_name
      END
    SQL
  end

  def subject_id
    <<-SQL
      CASE
        WHEN watchlists.id IS NOT NULL
          THEN watchlists.tv_show_id
        WHEN favorites.id IS NOT NULL
          THEN favorites.tv_show_id
        ELSE feed_items.subject_id
      END
    SQL
  end

  def created_at
    <<-SQL
      CASE
        WHEN watchlists.id IS NOT NULL
          THEN watchlists.created_at
        WHEN favorites.id IS NOT NULL
          THEN favorites.created_at
        WHEN follows.id IS NOT NULL
          THEN follows.created_at
      END
    SQL
  end

  def left_outer_join_watchlists
    watchlists = Watchlist.
      joins(:tv_show).
      select(<<-SQL)
        watchlists.*,
        tv_shows.title AS tv_show_title
      SQL

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
      joins(:tv_show).
      select(<<-SQL)
        favorites.*,
        tv_shows.title AS tv_show_title
      SQL

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
