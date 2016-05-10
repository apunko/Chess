class OpeningsController < ApplicationController
  def index
    @game = Game.new
    @game.jsongame = Game.get_init_state
  end

  def update
    half_move = params[:move]
    history = JSON.parse(params[:history])
    insert_half_move(history, half_move)
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
