class CreateFeedItems < ActiveRecord::Migration
  def change
    create_table :feed_items do |t|
      t.integer :user_id
      t.integer :idol_id
      t.integer :tv_show_id
      t.string :message
      t.timestamps
    end

    add_index :feed_items, :user_id
  end
end
