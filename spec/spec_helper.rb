# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV["RAILS_ENV"] ||= 'test'
require File.expand_path("../../config/environment", __FILE__)
require 'rspec/rails'
require 'shoulda/matchers'
require "paperclip/matchers"

# Requires supporting ruby files with custom matchers and macros, etc,
# in spec/support/ and its subdirectories.
Dir[Rails.root.join("spec/support/**/*.rb")].each { |f| require f }

# Checks for pending migrations before tests are run.
# If you are not using ActiveRecord, you can remove this line.
# ActiveRecord::Migration.check_pending! if defined?(ActiveRecord::Migration)
ActiveRecord::Migration.maintain_test_schema!

RSpec.configure do |config|
  # ## Mock Framework
  #
  # If you prefer to use mocha, flexmock or RR, uncomment the appropriate line:
  #
  # config.mock_with :mocha
  # config.mock_with :flexmock
  # config.mock_with :rr

  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  config.fixture_path = "#{::Rails.root}/spec/fixtures"

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = true

  # If true, the base class of anonymous controllers will be inferred
  # automatically. This will be the default behavior in future versions of
  # rspec-rails.
  config.infer_base_class_for_anonymous_controllers = false

  # Run specs in random order to surface order dependencies. If you find an
  # order dependency and want to debug it, you can fix the order by providing
  # the seed, which is printed after each run.
  #     --seed 1234
  config.order = "random"

  config.include FactoryGirl::Syntax::Methods
  config.include Paperclip::Shoulda::Matchers
end

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

shared_examples "a feed item subject" do
  before { create(:follow, idol_id: user.id, follower_id: follower.id) }

  it "has many feed items" do
    item_subject = create(subject, user_id => user.id)
    feed_items = item_subject.feed_items

    expect(item_subject).to respond_to(:feed_items)
    expect(feed_items).to be_an(ActiveRecord::Associations::CollectionProxy)
  end

  context "after save" do
    it "creates feed items for its user's followers after save" do
      create(subject, user_id => user.id)
      expect(follower.feed_items).not_to be_empty
    end

    it "doesn't create any new feed items if watcher has no followers" do
      Follow.destroy_all
      activity = create(subject, user_id => user.id)

      if subject == :follow
        expect(activity.feed_items.count).to eq(1)
      else
        expect(activity.feed_items).to be_empty
      end
    end

    it "destroys associated feed items on destruction" do
      new_subject = create(subject, user_id => user.id)
      new_subject.destroy!
      expect(new_subject.feed_items).to be_empty
    end
  end
end
