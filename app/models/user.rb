class User < ActiveRecord::Base

  extend FriendlyId
  friendly_id :email, use: [:slugged, :finders]

  devise :database_authenticatable, #:registerable,
         :recoverable, :rememberable, :trackable, :validatable
end
