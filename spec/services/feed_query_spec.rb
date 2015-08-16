describe FeedQuery do
  let(:user) { double(:user) }
  let(:service) { FeedQuery.new(user) }

  describe "#user" do
    it "initializes with a user" do
      expect(service.user).to eq(user)
    end
  end

  describe "#last_fetched" do
    it "initializes as nil by default" do
      expect(service.last_fetched).to be_nil
    end

    it "converts last_fetched to datetime when given" do
      service = FeedQuery.new(user, '2015-8-16')
      expect(service.last_fetched).to be_a DateTime
    end
  end

  describe "#recent_feed_items" do
    let(:user) { create(:user) }

    let!(:feed_items) do
      [
        create(:feed_item, user: user, created_at: 10.minutes.ago),
        create(:feed_item, user: user, created_at: 5.minutes.ago),
        create(:feed_item, user: user, created_at: 1.minute.ago)
      ]
    end

    it "returns all of user's feed items when last_fetched is nil" do
      expect(service.recent_feed_items.sort).to eq(feed_items.sort)
    end

    it "returns user's feed items created after last_fetched when not nil" do
      service = FeedQuery.new(user, 9.minutes.ago)
      expect(service.recent_feed_items.sort).to eq(feed_items.last(2).sort)
    end
  end

  describe "#feed_items" do
    let(:user) { create(:user) }
    let(:tv_show) { create(:tv_show, id: 14, title: "Twin Peaks") }

    it "returns all of the recent feed items" do
      feed_items = (0...3).to_a.map { create(:feed_item, user: user) }
      expect(service.feed_items.sort).to eq(feed_items.sort)
    end

    it "has an idol_name attribute" do
      idol = create(:user, username: "conz")
      create(:feed_item, user: user, idol: idol)

      expect(service.feed_items.first.idol_name).to eq("conz")
    end

    it "subject_name returns the TV show's title when watchlist item" do
      watchlist = create(:watchlist, tv_show: tv_show)
      create(:feed_item, user: user, subject: watchlist)

      expect(service.feed_items.first.subject_name).to eq("Twin Peaks")
    end

    it "subject_name returns the TV show's title when favorite item" do
      favorite = create(:favorite, tv_show: tv_show)
      create(:feed_item, user: user, subject: favorite)

      expect(service.feed_items.first.subject_name).to eq("Twin Peaks")
    end

    it "subject_name returns the follow's idol username when follow item" do
      follow = create(:follow, idol: create(:user, username: "conz"))
      create(:feed_item, user: user, subject: follow)

      expect(service.feed_items.first.subject_name).to eq("conz")
    end

    it "subject_id returns the TV show's id when watchlist item" do
      watchlist = create(:watchlist, tv_show: tv_show)
      create(:feed_item, user: user, subject: watchlist)

      expect(service.feed_items.first.subject_id).to eq(14)
    end

    it "subject_id returns the TV show's id when favorite item" do
      favorite = create(:favorite, tv_show: tv_show)
      create(:feed_item, user: user, subject: favorite)

      expect(service.feed_items.first.subject_id).to eq(14)
    end

    it "subject_id returns original subject_id if not watchlist or favorite" do
      create(:feed_item, user: user, subject_id: 21, subject_type: 'Follow')
      expect(service.feed_items.first.subject_id).to eq(21)
    end

    it "handles mixed feed item subjects correctly" do
      watchlist = create(:watchlist, tv_show: tv_show)
      create(:feed_item, user: user, subject: watchlist)

      favorite = create(:favorite, tv_show: create(:tv_show, title: "ABC"))
      create(:feed_item, user: user, subject: favorite)

      follow = create(:follow, idol: create(:user, username: "conz"))
      create(:feed_item, user: user, subject: follow)

      expect(service.feed_items.first.subject_name).to eq("conz")
      expect(service.feed_items.second.subject_name).to eq("ABC")
      expect(service.feed_items.third.subject_name).to eq("Twin Peaks")
    end
  end
end
