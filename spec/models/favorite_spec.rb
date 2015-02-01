describe Favorite do
  let(:favoriter) { create(:user) }

  it { should validate_presence_of(:tv_show) }
  it { should validate_scoped_uniqueness_of(:favoriter_id, :tv_show_id) }
  it { should belong_to(:tv_show) }
  it { should belong_to(:favoriter) }

  describe "feed items" do
    let(:follower) { create(:user) }
    before { create(:follow, idol_id: favoriter.id, follower_id: follower.id) }

    it "creates feed items for its favoriter's followers after save" do
      create(:favorite, favoriter_id: favoriter.id)
      expect(follower.feed_items).not_to be_empty
    end

    it "doesn't create any feed items if watcher has no followers" do
      Follow.destroy_all
      create(:favorite, favoriter_id: favoriter.id)
      expect(FeedItem.all).to be_empty
    end

    it "destroys any recent feed items on destruction" do
      favorite = create(:favorite, favoriter_id: favoriter.id)
      favorite.destroy!
      expect(FeedItem.all).to be_empty
    end

    it "doesn't destroy feed items if destroyed more than a minute later" do
      favorite = nil

      Timecop.travel(2.minutes.ago) do
        favorite = create(:favorite, favoriter_id: favoriter.id)
      end

      favorite.destroy!

      expect(FeedItem.count).to eq(1)
    end
  end
end