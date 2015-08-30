class Api::SearchesController < ApplicationController
  before_action :set_user

  def by_genre_and_decade
    search = GenreAndDecadeSearch.new(params).go
    @tv_results = search.tv_results

    render :search
  end

  def by_ids
    params[:tv_ids] ||= []
    params[:user_ids] ||= []

    @tv_results = Tv.find(params[:tv_ids])
    @user_results = User.with_watch_and_favorite_count.find(params[:user_ids])

    render :search
  end

  private
  def set_user
    return unless signed_in?
    @user = User.includes(:watchlists, :favorites).find(current_user.id)
  end
end
