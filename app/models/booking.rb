class Booking < ActiveRecord::Base

  validates_presence_of :name, :email, :message
  validates_length_of :name, :phone, maximum: 50
end
