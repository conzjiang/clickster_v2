class Api::SearchesController < ApplicationController
  before_action :set_user

  def by_genre_and_decade
    search = GenreAndDecadeSearch.new(params).go
    @tv_results = search.tv_results

    render :search
  end

  def by_ids
    tv_ids = params[:tv_ids] || []
    user_ids = params[:user_ids] || []
    watching = Watchlist.where(status: "Watching")

    @tv_results = TvShow.find(tv_ids)
    @user_results = User.
      select("users.*, COUNT(DISTINCT watchlists.id) AS watch_count, COUNT(DISTINCT favorites.id) AS favorite_count").
      joins("LEFT OUTER JOIN (#{watching.to_sql}) AS watchlists ON watchlists.watcher_id = users.id").
      joins("LEFT OUTER JOIN favorites ON favorites.favoriter_id = users.id").
      group("users.id").
      find(user_ids)

    render :text
  end

  private
  def set_user
    @user = User.includes(:watchlists, :favorites).find(current_user.id)
  end
end
