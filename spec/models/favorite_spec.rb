describe Favorite do
  let(:favoriter) { create(:user) }

  it { should validate_presence_of(:tv_show) }
  it { should belong_to(:tv_show) }
  it { should belong_to(:favoriter) }

  it "validates scoped uniqueness of favoriter_id vs. tv_show_id" do
    # shoulda-matchers keeps failing other validations when testing this one
    favorite = create(:favorite, favoriter_id: favoriter.id)
    bad_favorite = build(
      :favorite,
      favoriter_id: favoriter.id,
      tv_show_id: favorite.tv_show_id
    )

    expect(bad_favorite).not_to be_valid
    expect(bad_favorite.errors.keys).to include(:favoriter_id)
  end

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