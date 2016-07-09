Rails.application.routes.draw do

  mount RedactorRails::Engine => '/redactor_rails'

  devise_for :users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  root to: 'home#index'
  resources :boats, path: 'boats-for-sale', only: [:index, :show]
  resources :bookings, only: [:create]

  get :contact, to: 'home#contact', as: :contact
end
