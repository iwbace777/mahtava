ActiveAdmin.register Country do

  permit_params :name, :iso, :description, :country_code, :currency_id

end
