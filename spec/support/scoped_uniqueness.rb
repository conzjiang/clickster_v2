def factory_name(instance)
  instance.class.to_s.underscore.to_sym
end

RSpec::Matchers.define :validate_scoped_uniqueness_of do |user_id, scope|
  # need to associate with actual user so shoulda-matcher doesn't work
  match do |subject|
    user = create(:user)
    factory = factory_name(subject)
    subject = create(factory, user_id => user.id)
    bad_subject = build(
      factory,
      user_id => user.id,
      scope => subject.send(scope)
    )

    !bad_subject.valid? && bad_subject.errors.keys.include?(user_id)
  end

  failure_message do |subject|
    "expected that #{user_id} would be unique against #{scope}"
  end
end
