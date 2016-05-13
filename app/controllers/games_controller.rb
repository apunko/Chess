class GamesController < ApplicationController
  require 'json'
  load_and_authorize_resource

  def show
    @game = Game.find(params[:id])
  end

  def index
    @games = Game.all
  end

  def update
    game = Game.find(params[:id])
    board_state = params[:board_state]
    history = params[:history]
    game.jsongame = board_state.to_json
    game.history = history.to_json
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

end
