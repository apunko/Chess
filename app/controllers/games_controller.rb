class GamesController < ApplicationController
  
  def show
    @game = Game.find(params[:id])
  end

  def index
    
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
