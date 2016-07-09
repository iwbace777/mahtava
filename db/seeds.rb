require 'mechanize'

doc = Mechanize.new.get('http://www.currenciesdirect.com/common/rates.aspx?code=A04190&pass=A04190&base=GBP')

currency_rates = doc.search('price_history').inject({}) do |ph, price|
  unit_name = price.css('unit').first.content
  ph[unit_name] = price.css('rate').first.content.to_f
  ph
end

YAML.load_file(Rails.root.join('db/data/iso4217.yaml')).each do |code, currency_data|
  currency = Currency.where(name: code).first_or_initialize
  next unless currency.rate = currency_rates[code]
  currency.symbol = currency_data['symbol'] || code
  currency.save!
end

YAML.load_file(Rails.root.join('db/data/countries.yaml')).each do |code|
  country_data = YAML.load_file(Rails.root.join("db/data/countries/#{code}.yaml"))[code]
  name = country_data['names'].shift
  country = Country.where(name: name).first_or_initialize
  country.iso = country_data['alpha2']
  country.country_code = country_data['country_code']
  country.currency ||= Currency.where(name: country_data['currency']).first
  country.save!
end

User.create!(email: 'admin@example.com', password: 'password', password_confirmation: 'password', admin: true)