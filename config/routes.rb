Rails.application.routes.draw do
  root to: 'static_pages#root'

  resources :users, except: [:edit, :update]
  get 'profile/edit', to: 'users#edit', as: 'edit_user'
  put 'profile/update', to: 'users#update', as: 'update_user'

  resource :session, only: [:new, :create, :destroy]

  namespace :api, defaults: { format: :json } do
    get 'current_user', to: 'current_user#show'
    get 'current_user/tv_shows', to: 'current_user#tv_shows'
    post 'current_user/add_watchlist', to: 'current_user#add_watchlist'

    resources :users, only: [:create]
    get 'users/:username', to: 'users#show', as: 'user'
    resource :session, only: [:create]
    resources :tv_shows, only: [:create, :show, :update]

    get 'search', to: 'searches#get'
  end
end
