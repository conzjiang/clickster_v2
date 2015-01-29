class CreateFollows < ActiveRecord::Migration
  def change
    create_table :follows do |t|
      t.integer :follower_id
      t.integer :idol_id

      t.timestamps
    end

    add_index :follows, [:follower_id, :idol_id], unique: true
  end
end
