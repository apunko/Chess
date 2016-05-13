class Ability
  include CanCan::Ability

  def initialize(user)
    if user
      can :manage, Game
      cannot :update, :show, Game do |game|
        game.user_id != user.id
      end
      can :manage, Opening
    end
  end
end