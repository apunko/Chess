class OpeningsController < ApplicationController
  def index
    @game = Game.new
    @game.jsongame = Game.get_init_state
  end

  def update
    new_opening_line = params[:history]
    opening = Opening.last
    tree = Tree::TreeNode.new('', '')
    #tree = Tree::TreeNode.json_create(opening.tree)
    opening.tree = opening.insertOpeningLine(tree, new_opening_line)
    opening.save
    render nothing: true
  end

end
