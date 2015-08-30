class Api::SearchesController < ApplicationController
  before_action :set_user

  def by_genre_and_decade
    search = GenreAndDecadeSearch.new(params).go
    @tv_results = search.tv_results

    render :search
  end

  def by_ids
    search = SearchByIds.new(params)
    @tv_results = search.tv_results
    @user_results = search.user_results

    render :search
  end

  private
  def set_user
    return unless signed_in?
    @user = User.includes(:watchlists, :favorites).find(current_user.id)
  end
end
