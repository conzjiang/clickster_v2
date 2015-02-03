describe FeedItem do
  it { should validate_presence_of(:user_id) }
  it { should validate_presence_of(:message) }
  it { should belong_to(:user) }
  it { should belong_to(:idol) }
  it { should belong_to(:subject) }

  describe "#feed_message" do
    it "returns a full message" do
      tv_show = create(:tv_show, title: "Blue")
      user = create(:user, username: "conz")
      feed_item = create(
        :feed_item,
        idol: user,
        subject: build(:watchlist, tv_show_id: tv_show.id),
        message: " is now watching "
      )

      expect(feed_item.feed_message).to eq("conz is now watching Blue")
    end

    it "message subject is idol" do
      idol = create(:user)
      feed_item = create(:feed_item, idol: idol)
      expect(feed_item.feed_message).to include(idol.username)
    end

    it "uses TV show title if subject is watchlist or favorite" do
      watchlist = create(:watchlist)
      feed_item = create(:feed_item, subject: watchlist)
      expect(feed_item.feed_message).to include(watchlist.tv_show.title)
    end

    it "uses username if subject is follow" do
      follow = create(:follow)
      feed_item = create(:feed_item, subject: follow)
      expect(feed_item.feed_message).to include(follow.idol.username)
    end
  end
end