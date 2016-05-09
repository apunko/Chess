class CreateOpenings < ActiveRecord::Migration
  def change
    create_table :openings do |t|
      t.text :tree

      t.timestamps null: false
    end
  end
end
