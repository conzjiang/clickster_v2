class CreateFavorites < ActiveRecord::Migration
  def change
    create_table :favorites do |t|
      t.integer :tv_show_id
      t.integer :favoriter_id
    end

    add_index :favorites, :tv_show_id
    add_index :favorites, :favoriter_id
  end
end
