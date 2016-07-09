module ApplicationHelper

  def nav_class_for(condition)
    if condition.is_a?(Regexp)
      return 'active' if "#{controller_path}##{action_name}" =~ condition
    else
      controller, action = condition.to_s.split('#')
      return 'active' if (controller_path.blank? || controller == controller_path) && (action.blank? || action == action_name)
    end
  end

  def bootstrap_class_for(flash_type)
    case flash_type.to_sym
      when :alert
        "warning"
      when :notice
        "info"
      else
        flash_type.to_s
    end
  end

  def price_in_euro(price, source_currency)
    target_currency = Currency.find_by(name: 'EUR')
    cp = Currency.convert(price, source_currency, target_currency)
    number_to_currency cp, precision: 0, unit: target_currency.symbol
  end
end
