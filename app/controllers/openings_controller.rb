class OpeningsController < ApplicationController
  def index
    @game = Game.new
    @game.jsongame = Game.get_init_state
  end

  def update
    new_opening_array = params[:history]
    tree = Tree::TreeNode.new("", "")
    Opening.create(tree: tree.to_json)
  end

  private

  def insert_half_move(history, half_move)
    puts "insert_half_move started"
    @opening = Opening.first
    history.foreach do |move|
      move.foreach do |half_move|
        @i = 1
      end 
    end 
    opening.update
    puts "insert_half_move ended"
  end
end
