class CreateBoatImages < ActiveRecord::Migration
  def change
    create_table :boat_images do |t|
      t.integer :boat_id, default: 0
      t.string :folder_name, default: ''
      t.integer :count, default: 0
      t.timestamps null: false
    end
  end
end
