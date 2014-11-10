class CreateTvDecades < ActiveRecord::Migration
  def change
    create_table :tv_decades do |t|
      t.integer :decade
      t.integer :tv_show_id

      t.timestamps
    end

    add_index :tv_decades, [:decade, :tv_show_id], unique: true
  end
end
