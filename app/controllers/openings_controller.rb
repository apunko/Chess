class OpeningsController < ApplicationController
  require 'json'
  require 'opening_node.rb'
  load_and_authorize_resource

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


  def get_move
    history = params[:history]
    opening = Opening.last
    tree = OpeningNode.from_json(opening.tree)
    data_move = opening.find_next_move(tree, history)
    data = {:move => data_move[0], :message => data_move[1]}
    render :json => data, :status => :ok
  end

end
