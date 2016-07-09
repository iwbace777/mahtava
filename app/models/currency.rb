class Currency < ActiveRecord::Base

  def self.default
    find_by(name: 'GBP')
  end

  def self.convert(amount, source, target)
    source ||= Currency.default
    return amount if source == target
    amount * target.rate / source.rate
  end
end
