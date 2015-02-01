describe Watchlist do
  let(:watcher) { create(:user) }

  it { should define_enum_for(:status) }
  it { should validate_presence_of(:status) }
  it { should validate_presence_of(:watcher) }
  it { should validate_scoped_uniqueness_of(:watcher_id, :tv_show_id) }
  it { should belong_to(:watcher) }
  it { should belong_to(:tv_show) }

  it "#feed_message is dependent on its status" do
    watchlist = build(:watchlist, status: 1)
    expect(watchlist.feed_message).to eq(" plans to watch ")
  end

  it_behaves_like "a feed item subject" do
    let(:subject) { :follow }
    let(:user_id) { :follower_id }
    let(:follower) { create(:user) }
    let(:user) { watcher }

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