Rails.application.routes.draw do

  get 'openings/index'
  patch 'openings/index', to: 'openings#update'
  get 'games/show'

  post 'openings/get_move'

  get 'games/index'

  get 'games/create'

  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }

  resources :users, only: [:index, :show, :update]
  resources :games, only: [:index, :show, :create, :update]
  resources :openings, only: [:index, :update]


  root 'application#index'
end
