describe Follow do
  let(:user) { create(:user) }

  it { should validate_presence_of(:follower) }
  it { should validate_presence_of(:idol) }
  it { should validate_scoped_uniqueness_of(:follower_id, :idol_id) }
  it { should belong_to(:follower) }
  it { should belong_to(:idol) }

  it_behaves_like "a feed item subject" do
    let(:subject) { :follow }
    let(:user_id) { :follower_id }
    let(:follower) { create(:user) }
  end

  describe "#notify_idol" do
    let(:idol) { create(:user, username: "carl") }

    before :each do
      follower = create(:user, username: "conz")
      Follow.create!(follower: follower, idol: idol)
    end

    it "creates a feed item for the idol for a new follow" do
      expect(idol.feed_items).not_to be_empty
    end

    it "feed item has the correct message" do
      feed_item = idol.feed_items.first
      expect(feed_item.feed_message).to eq("conz is now following carl")
    end
  end
end
