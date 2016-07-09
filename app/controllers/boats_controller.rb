class BoatsController < ApplicationController

  def index
    session[:sort] = params[:sort] if params[:sort].present?
    session[:order] = params[:order] if params[:order].present?

    @response = Rails.cache.fetch "arvor.boats", expires_in: 1.day do
      JSON.parse(RestClient.get('http://eby.rightboatexpert.com/api/boats?keyword=arvor'))
    end

    @boats = @response['results']
    @boats = case session[:sort]
               when 'price', 'relevancy', 'smart'; @boats.sort_by { |x| x['price'] }
               when 'arrival'; @boats.sort_by { |x| x['stock_number'].downcase }
               when 'year'; @boats.sort_by { |x| (x['year'] || (Date.today.year - 20)) }
               else; @boats.sort_by { |x| x[session[:sort]] }
             end
    @boats = @boats.reverse if session[:order] && session[:order] == 'desc'
    @boats_all = Boat.all()
  end

  def show
    @boats = Boat.all()
    @boat  = Boat.find(params[:id])
  end
end
