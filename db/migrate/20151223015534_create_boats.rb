class CreateBoats < ActiveRecord::Migration
  def change
    create_table :boats do |t|
      t.string :name
      t.string :short_description
      t.text :description
      t.text :safety
      t.text :fishing
      t.text :comfort
      t.text :storage
      t.string :slug
      t.boolean :is_new,    default: false

      t.timestamps null: false
    end

    add_index :boats, :slug
  end
end
