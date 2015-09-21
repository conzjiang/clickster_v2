class RemoveImageUrlFromUsersAndTvShows < ActiveRecord::Migration
  def change
    remove_column :users, :image_url, :string
    remove_column :tv_shows, :image_url, :string
  end
end
