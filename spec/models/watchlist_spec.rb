describe Watchlist do
  it { should define_enum_for(:status) }
  it { should validate_presence_of(:status) }
  it { should validate_uniqueness_of(:tv_show_id).scoped_to(:watcher_id) }
  it { should belong_to(:watcher) }
  it { should belong_to(:tv_show) }
end