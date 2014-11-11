class CreateTvGenres < ActiveRecord::Migration
  def change
    create_table :tv_genres do |t|
      t.integer :tv_show_id
      t.integer :genre

      t.timestamps
    end

    add_index :tv_genres, [:tv_show_id, :genre], unique: true
  end
end
