class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter :load_boats


  private

  def load_boats
  	@boats = Boat.all
  	@featured_boats = Boat.all
  end
end
