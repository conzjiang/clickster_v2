Rails.application.routes.draw do
  root to: 'static_pages#root'

  resources :users, except: [:edit, :update]
  get 'profile/edit', to: 'users#edit', as: 'edit_user'
  put 'profile/update', to: 'users#update', as: 'update_user'

  resource :session, only: [:new, :create, :destroy]
  get 'auth/facebook/callback', to: 'sessions#facebook'

  namespace :api, defaults: { format: :json } do
    resource :current_user, only: [:show, :update]
    get "current_user/feed", to: "current_users#feed"

    resources :users, only: [:create]
    get 'users/:username', to: 'users#show'
    post "users/:username/follow", to: "users#follow"

    resource :session, only: [:create]
    post 'session/demo', to: 'sessions#demo'

    get 'tv_shows/admin', to: 'tv_shows#admin'
    resources :tv_shows, only: [:index, :create, :show, :update]
    post 'tv_shows/:id/favorite', to: "tv_shows#favorite"
    post 'tv_shows/:id/watchlist', to: "tv_shows#watchlist"

    get 'genres/:genre', to: "tv_shows#genre"

    get 'search', to: 'searches#get'
    get 'search/ids', to: "searches#ids"
  end
end
