class AddImageUrlToTvShows < ActiveRecord::Migration
  def change
    add_column :tv_shows, :image_url, :string
  end
end
