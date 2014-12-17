# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20141217020031) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "favorites", force: true do |t|
    t.integer  "tv_show_id"
    t.integer  "favoriter_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "favorites", ["favoriter_id"], name: "index_favorites_on_favoriter_id", using: :btree
  add_index "favorites", ["tv_show_id"], name: "index_favorites_on_tv_show_id", using: :btree

  create_table "tv_decades", force: true do |t|
    t.integer  "decade"
    t.integer  "tv_show_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "tv_decades", ["decade", "tv_show_id"], name: "index_tv_decades_on_decade_and_tv_show_id", unique: true, using: :btree

  create_table "tv_genres", force: true do |t|
    t.integer  "tv_show_id"
    t.integer  "genre"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "tv_genres", ["tv_show_id", "genre"], name: "index_tv_genres_on_tv_show_id_and_genre", unique: true, using: :btree

  create_table "tv_shows", force: true do |t|
    t.string   "title",       null: false
    t.text     "blurb"
    t.integer  "num_seasons"
    t.integer  "start_year"
    t.integer  "end_year"
    t.integer  "status"
    t.integer  "admin_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.float    "rating"
    t.string   "imdb_id"
    t.string   "network"
    t.string   "image_url"
  end

  add_index "tv_shows", ["title"], name: "index_tv_shows_on_title", using: :btree

  create_table "users", force: true do |t|
    t.string   "email",                           null: false
    t.string   "username",                        null: false
    t.string   "password_digest"
    t.string   "session_token"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "is_admin",        default: false
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["username"], name: "index_users_on_username", unique: true, using: :btree

  create_table "watchlists", force: true do |t|
    t.integer  "watcher_id"
    t.integer  "tv_show_id"
    t.integer  "status"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "watchlists", ["tv_show_id"], name: "index_watchlists_on_tv_show_id", using: :btree
  add_index "watchlists", ["watcher_id"], name: "index_watchlists_on_watcher_id", using: :btree

end
