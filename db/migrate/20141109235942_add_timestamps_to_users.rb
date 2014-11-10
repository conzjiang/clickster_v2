class AddTimestampsToUsers < ActiveRecord::Migration
  def up
    drop_table :users

    create_table :users do |t|
      t.string :email, null: false
      t.string :username, null: false
      t.string :password_digest
      t.string :session_token

      t.timestamps
    end

    add_index :users, :email, unique: true
    add_index :users, :username, unique: true
  end

  def down
    drop_table :users

    create_table :users do |t|
      t.string :email, null: false
      t.string :username, null: false
      t.string :password_digest
      t.string :session_token
    end

    add_index :users, :email, unique: true
    add_index :users, :username, unique: true
  end
end
