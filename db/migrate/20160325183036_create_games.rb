class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :jsongame
      t.boolean :computermove
      t.boolean :useriswhite
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end