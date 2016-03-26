class ChangeColumnType < ActiveRecord::Migration
  def change
    change_column :games, :jsongame, :text
  end
end
