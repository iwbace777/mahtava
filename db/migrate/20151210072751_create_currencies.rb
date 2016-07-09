class CreateCurrencies < ActiveRecord::Migration
  def change
    create_table :currencies do |t|
      t.string :name
      t.string :symbol
      t.float :rate,        default: 1.0

      t.timestamps null: false
    end

    add_index :currencies, :name
    add_index :currencies, :symbol
  end
end
