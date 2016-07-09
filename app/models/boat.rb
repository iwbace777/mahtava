class Boat < ActiveRecord::Base

  extend FriendlyId
  friendly_id :name, use: [:slugged, :finders]

  validates_presence_of :name, :description, :safety, :fishing, :comfort, :storage
  validates_length_of :name, :short_description, maximum: 255

  def image
  	"#{name.downcase.gsub(/\s+/, '-')}.jpg"
  end

  has_one :boat_image
  has_one :boat_specifiction
  has_one :boat_price
end
