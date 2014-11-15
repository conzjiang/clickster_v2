class AddRatingAndImdbIdToTvShows < ActiveRecord::Migration
  def change
    add_column :tv_shows, :rating, :float
    add_column :tv_shows, :imdb_id, :string
  end
end
