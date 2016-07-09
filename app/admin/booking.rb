ActiveAdmin.register Booking do

  permit_params :name, :email, :phone, :message

end
