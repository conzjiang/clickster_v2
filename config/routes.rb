Rails.application.routes.draw do
  root to: 'static_pages#root'

  resources :users, except: [:edit, :update]
  get 'profile/edit', to: 'users#edit', as: 'edit_user'
  put 'profile/update', to: 'users#update', as: 'update_user'

  resource :session, only: [:new, :create, :destroy]

  namespace :api, defaults: { format: :json } do
    get 'current_user', to: 'api#current'

    resources :users, only: [:create]
    resource :session, only: [:create]
  end
end
