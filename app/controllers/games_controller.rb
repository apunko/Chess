class GamesController < ApplicationController
  require 'json'
  def show
    @game = Game.find(params[:id])
  end

  def index
    
  end

  def update
    game = Game.find(params[:id])
    moves = params[:moves]
    board_state = JSON.parse(game.jsongame) 
    board_state[moves[:after][0]] = moves[:after][1]
    board_state.delete(moves[:before][0])
    game.jsongame = board_state.to_json
    game.save
    render nothing: true
  end

  def create
    @game = Game.new
    @game.user_id = params[:id]
    @game.jsongame = Game.get_init_state
    @game.useriswhite = true
    @game.computermove = false 
    @game.save
    redirect_to game_url(@game.id)
  end

  def game_params
    params.require(:game).permit(:user_id)
  end
end
