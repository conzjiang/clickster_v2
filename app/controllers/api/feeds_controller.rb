class Api::FeedsController < ApplicationController
  NUM_ITEMS_TO_DISPLAY = 3

  before_action :require_signed_in!

  def new
    @feed_items = FeedQuery.new(
        current_user,
        params[:last_fetched]
      ).feed_items.limit(NUM_ITEMS_TO_DISPLAY).to_a

    if @feed_items.empty?
      @recommendations = recommendations
    end

    render :show
  end

  def show
    @feed_items = FeedQuery.new(current_user).feed_items
  end

  private
  def recommendations
    FeedRecommendations.new(current_user, NUM_ITEMS_TO_DISPLAY + 1).users
  end

  def require_signed_in!
    unless signed_in?
      render({
        json: ['You must be signed in to perform this action.'],
        status: 403
      })
    end
  end
end
