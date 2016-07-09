class BookingsController < ApplicationController
  def create
    @booking = Booking.new(booking_params)

    if @booking.save
      redirect_to :back, notice: 'Your request sent successfully.'
    else
      redirect_to :back, alert: 'Oops, something went wrong. Please try again later.'
    end
  end

  private

  def booking_params
    params.require(:booking).permit(:name, :phone, :email, :message)
  end
end
