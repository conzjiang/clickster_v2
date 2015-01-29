describe Watchlist do
  subject(:watchlist) { create(:watchlist) }

  it { should define_enum_for(:status) }
  it { should validate_presence_of(:status) }
  it { should belong_to(:watcher) }
  it { should belong_to(:tv_show) }

  it "validates scoped uniqueness of tv_show vs. watcher" do
    bad_watchlist = build(
      :watchlist,
      tv_show: watchlist.tv_show,
      watcher: watchlist.watcher
    )

    expect(bad_watchlist).not_to be_valid
  end
end