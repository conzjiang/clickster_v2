RSpec::Matchers.define :be_uniq do
  match do |array|
    array.uniq == array
  end

  failure_message do |array|
    "expected #{array} to contain unique elements"
  end
end
