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

ActiveRecord::Schema.define(version: 20160112082757) do

  create_table "active_admin_comments", force: :cascade do |t|
    t.string   "namespace",     limit: 255
    t.text     "body",          limit: 65535
    t.string   "resource_id",   limit: 255,   null: false
    t.string   "resource_type", limit: 255,   null: false
    t.integer  "author_id",     limit: 4
    t.string   "author_type",   limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "active_admin_comments", ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id", using: :btree
  add_index "active_admin_comments", ["namespace"], name: "index_active_admin_comments_on_namespace", using: :btree
  add_index "active_admin_comments", ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id", using: :btree

  create_table "boat_images", force: :cascade do |t|
    t.integer  "boat_id",     limit: 4,   default: 0
    t.string   "folder_name", limit: 255, default: ""
    t.integer  "count",       limit: 4,   default: 0
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
  end

  create_table "boat_prices", force: :cascade do |t|
    t.integer  "boat_id",    limit: 4,    default: 0
    t.string   "item",       limit: 1000, default: ""
    t.string   "price",      limit: 255,  default: ""
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
  end

  create_table "boat_specifictions", force: :cascade do |t|
    t.integer  "boat_id",                limit: 4,   default: 0
    t.string   "engine",                 limit: 255, default: ""
    t.string   "length_overall",         limit: 255, default: ""
    t.string   "length_of_hull",         limit: 255, default: ""
    t.string   "beam",                   limit: 255, default: ""
    t.string   "height_without_canvas",  limit: 255, default: ""
    t.string   "draft",                  limit: 255, default: ""
    t.string   "dry_weight",             limit: 255, default: ""
    t.string   "fuel_capacity",          limit: 255, default: ""
    t.string   "ce_design_category",     limit: 255, default: ""
    t.string   "maximum_capacity",       limit: 255, default: ""
    t.string   "maximum_load",           limit: 255, default: ""
    t.string   "maximum_power",          limit: 255, default: ""
    t.string   "water_tank",             limit: 255, default: ""
    t.string   "fuel_tank_max_capacity", limit: 255, default: ""
    t.string   "fuel_tank_type",         limit: 255, default: ""
    t.string   "hull_deck",              limit: 255, default: ""
    t.string   "cockpit",                limit: 255, default: ""
    t.string   "bow",                    limit: 255, default: ""
    t.string   "helm",                   limit: 255, default: ""
    t.string   "cabin",                  limit: 255, default: ""
    t.string   "galley",                 limit: 255, default: ""
    t.string   "head_equipment",         limit: 255, default: ""
    t.datetime "created_at",                                      null: false
    t.datetime "updated_at",                                      null: false
  end

  create_table "boats", force: :cascade do |t|
    t.string   "name",              limit: 255
    t.string   "short_description", limit: 255
    t.text     "description",       limit: 65535
    t.text     "safety",            limit: 65535
    t.text     "fishing",           limit: 65535
    t.text     "comfort",           limit: 65535
    t.text     "storage",           limit: 65535
    t.string   "slug",              limit: 255
    t.boolean  "is_new",                          default: false
    t.datetime "created_at",                                      null: false
    t.datetime "updated_at",                                      null: false
  end

  add_index "boats", ["slug"], name: "index_boats_on_slug", using: :btree

  create_table "bookings", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.string   "email",      limit: 255
    t.string   "phone",      limit: 255
    t.text     "message",    limit: 65535
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  create_table "countries", force: :cascade do |t|
    t.string   "name",         limit: 255
    t.string   "iso",          limit: 255
    t.string   "description",  limit: 255
    t.string   "country_code", limit: 255
    t.string   "currency_id",  limit: 255
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  add_index "countries", ["currency_id"], name: "index_countries_on_currency_id", using: :btree
  add_index "countries", ["iso"], name: "index_countries_on_iso", using: :btree
  add_index "countries", ["name"], name: "index_countries_on_name", using: :btree

  create_table "currencies", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.string   "symbol",     limit: 255
    t.float    "rate",       limit: 24,  default: 1.0
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
  end

  add_index "currencies", ["name"], name: "index_currencies_on_name", using: :btree
  add_index "currencies", ["symbol"], name: "index_currencies_on_symbol", using: :btree

  create_table "redactor_assets", force: :cascade do |t|
    t.string   "data_file_name",    limit: 255, null: false
    t.string   "data_content_type", limit: 255
    t.integer  "data_file_size",    limit: 4
    t.integer  "assetable_id",      limit: 4
    t.string   "assetable_type",    limit: 30
    t.string   "type",              limit: 30
    t.integer  "width",             limit: 4
    t.integer  "height",            limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "redactor_assets", ["assetable_type", "assetable_id"], name: "idx_redactor_assetable", using: :btree
  add_index "redactor_assets", ["assetable_type", "type", "assetable_id"], name: "idx_redactor_assetable_type", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",                  limit: 255, default: "",    null: false
    t.string   "encrypted_password",     limit: 255, default: "",    null: false
    t.string   "reset_password_token",   limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          limit: 4,   default: 0,     null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip",     limit: 255
    t.string   "last_sign_in_ip",        limit: 255
    t.string   "confirmation_token",     limit: 255
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email",      limit: 255
    t.string   "slug",                   limit: 255
    t.boolean  "admin",                              default: false
    t.datetime "created_at",                                         null: false
    t.datetime "updated_at",                                         null: false
  end

  add_index "users", ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true, using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  add_index "users", ["slug"], name: "index_users_on_slug", unique: true, using: :btree

end
