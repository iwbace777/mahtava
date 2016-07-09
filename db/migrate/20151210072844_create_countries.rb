class CreateCountries < ActiveRecord::Migration
  def change
    create_table :countries do |t|
      t.string :name
      t.string :iso
      t.string :description
      t.string :country_code
      t.string :currency_id

      t.timestamps null: false
    end

    add_index :countries, :currency_id
    add_index :countries, :name
    add_index :countries, :iso
  end
end
