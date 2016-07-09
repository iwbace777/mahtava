ActiveAdmin.register Boat do

  permit_params :name, :short_description, :description, :safety, :fishing, :comfort, :storage, :is_new

  index do
    selectable_column
    id_column
    column :name
    column :short_description
    column :description
    column :is_new
    column :created_at
    actions
  end

  filter :name
  filter :created_at

  form do |f|
    f.inputs "Boat Details" do
      f.input :name
      f.input :short_description
      f.input :description, input_html: { class: 'redactor' }
      f.input :safety, input_html: { class: 'redactor' }
      f.input :fishing, input_html: { class: 'redactor' }
      f.input :comfort, input_html: { class: 'redactor' }
      f.input :storage, input_html: { class: 'redactor' }
      f.input :is_new
    end
    f.actions
  end
end
