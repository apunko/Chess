class AddHistoryToGame < ActiveRecord::Migration
  def change
    add_column :games, :history, :text
  end
end
