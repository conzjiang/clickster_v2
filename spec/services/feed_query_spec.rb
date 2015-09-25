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

  describe "#feed_items" do
    let(:user) { create(:user) }
    let(:tv_show) { create(:tv_show, id: 14, title: "Twin Peaks") }

    let(:feed_items) do
      [
        create(:feed_item, {
          user: user,
          subject: create(:watchlist, created_at: 10.minutes.ago)
        }),

        create(:feed_item, {
          user: user,
          subject: create(:watchlist, created_at: 5.minutes.ago)
        }),

        create(:feed_item, {
          user: user,
          subject: create(:watchlist, created_at: 1.minute.ago)
        })
      ]
    end

    it "returns all of user's feed items if last_fetched is nil" do
      expect(feed_items.sort).to eq(service.feed_items.sort)
    end

    it "returns feed items w/ subjects created after last_fetched if not nil" do
      service = FeedQuery.new(user, 9.minutes.ago)
      expect(feed_items.last(2).sort).to eq(service.feed_items.sort)
    end

    it "sorts by most recent subject_created_at" do
      watchlist2 = create(:watchlist, created_at: 5.minutes.ago)
      watchlist3 = create(:watchlist, created_at: 10.minutes.ago)
      watchlist1 = create(:watchlist)

      feed_item2 = create(:feed_item, user: user, subject: watchlist2)
      feed_item3 = create(:feed_item, user: user, subject: watchlist3)
      feed_item1 = create(:feed_item, user: user, subject: watchlist1)

      expect(service.feed_items).to eq([feed_item1, feed_item2, feed_item3])
    end

    context "virtual attributes" do
      it "has an idol_id attribute" do
        idol = create(:user, id: 20, username: "conz")
        create(:feed_item, user: user, idol: idol)

        expect(service.feed_items.first.idol_id).to eq(20)
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

      it "subject_id returns item's subject_id if not watchlist or favorite" do
        create(:feed_item, user: user, subject_id: 21, subject_type: 'Follow')
        expect(service.feed_items.first.subject_id).to eq(21)
      end

      it "subject_created_at returns subject's created_at" do
        time = 10.minutes.ago
        follow = create(:follow, created_at: time)
        create(:feed_item, user: user, subject: follow)

        subject_created_at = service.feed_items.first.subject_created_at
        subject_created_at = subject_created_at.change(usec: 0)

        expect(subject_created_at).to eq(time.change(usec: 0))
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
end
