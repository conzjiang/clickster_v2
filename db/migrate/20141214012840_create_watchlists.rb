class CreateWatchlists < ActiveRecord::Migration
  def change
    create_table :watchlists do |t|
      t.integer :watcher_id
      t.integer :tv_show_id
      t.integer :status
      t.timestamps
    end

    add_index :watchlists, :watcher_id
    add_index :watchlists, :tv_show_id
  end
end
