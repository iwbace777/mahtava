require 'nokogiri'
require 'open_uri_redirections'

namespace :import do
  desc "Import currency exchange rates from CurrenciesDirect.com"
  task :currency => :environment do
    url = "http://www.currenciesdirect.com/common/rates.aspx?code=A04190&pass=A04190&base=GBP"
    doc = Nokogiri::HTML(open(url, allow_redirections: :safe))

    doc.css("price_history").each do |price|
      unit_name = price.css('unit').first.content
      if currency = Currency.find_by(name: unit_name)
        currency.update rate: price.css('rate').first.content
      end
    end
  end
end
