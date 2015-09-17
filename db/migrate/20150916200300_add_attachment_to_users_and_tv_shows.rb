class AddAttachmentToUsersAndTvShows < ActiveRecord::Migration
  def up
    add_attachment :users, :image
    add_attachment :tv_shows, :image
  end

  def down
    remove_attachment :users, :image
    remove_attachment :tv_shows, :image
  end
end
