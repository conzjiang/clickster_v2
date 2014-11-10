class CreateTvShows < ActiveRecord::Migration
  def change
    create_table :tv_shows do |t|
      t.string :title, null: false
      t.text :blurb
      t.integer :num_seasons
      t.integer :start_year
      t.integer :end_year
      t.integer :status
      t.integer :admin_id

      t.timestamps
    end

    add_index :tv_shows, :title
  end
end
