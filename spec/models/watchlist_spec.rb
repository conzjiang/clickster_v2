describe Watchlist do
  let(:watcher) { create(:user) }

  it { should define_enum_for(:status) }
  it { should validate_presence_of(:status) }
  it { should validate_presence_of(:watcher) }
  it { should belong_to(:watcher) }
  it { should belong_to(:tv_show) }

  it "validates scoped uniqueness of tv_show_id vs. watcher_id" do
    # shoulda-matchers keeps failing other validations when testing this one
    watchlist = create(:watchlist, watcher_id: watcher.id)
    bad_watchlist = build(
      :watchlist,
      watcher_id: watcher.id,
      tv_show_id: watchlist.tv_show_id
    )

    expect(bad_watchlist).not_to be_valid
    expect(bad_watchlist.errors.keys).to include(:tv_show_id)
  end

  it "#feed_message is dependent on its status" do
    watchlist = build(:watchlist, status: 1)
    expect(watchlist.feed_message).to eq(" plans to watch ")
  end

  describe "after save" do
    let(:follower) { create(:user) }
    before { create(:follow, idol_id: watcher.id, follower_id: follower.id) }

    it "creates a feed item for its watcher's followers" do
      create(:watchlist, watcher_id: watcher.id)
      expect(follower.feed_items).not_to be_empty
    end

    it "doesn't create any feed items if watcher has no followers" do
      Follow.destroy_all
      create(:watchlist, watcher_id: watcher.id)
      expect(FeedItem.all).to be_empty
    end

    it "destroys any feed items that were created within the minute" do
      watchlist = create(:watchlist, watcher_id: watcher.id, status: 1)
      watchlist.update!(status: 0)
      expect(FeedItem.count).to eq(1)
    end

    it "doesn't destroy any that were created more than a minute ago" do
      watchlist = nil

      Timecop.travel(2.minutes.ago) do
        watchlist = create(:watchlist, watcher_id: watcher.id, status: 1)
      end

      watchlist.update!(status: 0)

      expect(FeedItem.count).to eq(2)
    end
  end

end