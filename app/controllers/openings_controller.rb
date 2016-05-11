class OpeningsController < ApplicationController
  require 'json'
  require 'opening_node.rb'
  def index
    @game = Game.new
    @game.jsongame = Game.get_init_state
  end

  def update
    new_opening_line = params[:history]
    messages = params[:messages]
    opening = Opening.last
    #tree = OpeningNode.new('', '')
    tree = OpeningNode.from_json(opening.tree)
    opening.tree = opening.insert_opening_line(tree, new_opening_line, messages).to_json
    opening.save
    render nothing: true
  end

end
