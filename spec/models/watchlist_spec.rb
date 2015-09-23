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
    expect(watchlist.feed_message).to eq("plans to watch")
  end

  it_behaves_like "a feed item subject" do
    let(:subject) { :follow }
    let(:user_id) { :follower_id }
    let(:follower) { create(:user) }
    let(:user) { watcher }

    it "replaces old feed items w/ new ones when updating within the minute" do
      watchlist = create(:watchlist, watcher_id: watcher.id, status: 1)

      expect do
        watchlist.update!(status: 0)
      end.to change { FeedItem.count }.by(0)
    end

    it "doesn't destroy any that were created more than a minute ago" do
      watchlist = nil

      Timecop.travel(2.minutes.ago) do
        watchlist = create(:watchlist, watcher_id: watcher.id, status: 1)
      end

      expect { watchlist.update!(status: 0) }.to change { FeedItem.count }.by(1)
    end
  end
end
