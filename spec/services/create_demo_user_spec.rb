describe CreateDemoUser do
  let(:demo_user) { create(:user) }
  let(:service) { CreateDemoUser.new(demo_user) }

  describe "::new_demo_user!" do
    it "creates a new demo user" do
      expect(User).to receive(:create_demo_user!)
      CreateDemoUser.new_demo_user!
    end

    it "creates a new demo user with username if given" do
      expect(User).to receive(:create_demo_user!).with("abc")
      CreateDemoUser.new_demo_user!("abc")
    end
  end

  describe "::go!" do
    it "sets up a new demo user with everything" do
      service = double(:create_demo_user)
      allow(CreateDemoUser).to receive(:new).and_return(service)

      expect(service).to receive(:go!)
      CreateDemoUser.go!
    end
  end

  describe "::tv_shows" do
    it "returns all of the TV shows" do
      expect(CreateDemoUser.tv_shows).to eq(TvShow.all)
    end
  end

  describe "#initialize" do
    it "initializes with a demo user passed in" do
      demo_user = double(:demo_user)
      service = CreateDemoUser.new(demo_user)
      expect(service.demo_user).to eq(demo_user)
    end
  end

  describe "associations" do
    let(:tv_shows) do
      tv_shows = []

      10.times do |i|
        id = i + 1
        tv_show_name = "tv_show#{id}".to_sym
        tv_shows << double(tv_show_name, id: id)
      end

      tv_shows
    end

    before :each do
      allow(CreateDemoUser).to receive(:tv_shows).and_return(tv_shows)
    end

    context "class builds" do
      let(:user) { User.new }

      describe "::build_watchlists" do
        it "builds watchlists for the given user" do
          CreateDemoUser.build_watchlists(user)
          expect(user.watchlists).not_to be_empty
        end

        it "defaults to making 6 watchlists" do
          expect(CreateDemoUser.build_watchlists(user).length).to eq(6)
        end

        it "makes the provided number of watchlists" do
          expect(CreateDemoUser.build_watchlists(user, 3).length).to eq(3)
        end
      end

      describe "::build_favorites" do
        it "builds favorites for the given user" do
          CreateDemoUser.build_favorites(user)
          expect(user.favorites).not_to be_empty
        end

        it "defaults to making 2 favorites" do
          expect(CreateDemoUser.build_favorites(user).length).to eq(2)
        end

        it "makes the provided number of favorites" do
          expect(CreateDemoUser.build_favorites(user, 1).length).to eq(1)
        end
      end
    end

    context "persisted associations" do
      describe "#create_watchlists!" do
        it "creates 6 watchlists for the demo user" do
          expect(CreateDemoUser).to(
            receive(:build_watchlists).with(demo_user).and_call_original
          )
          service.create_watchlists!

          expect(Watchlist.count).to eq(6)
        end
      end

      describe "#create_favorites!" do
        before :each do
          allow(CreateDemoUser).to receive(:tv_shows).and_return([
            create(:tv_show),
            create(:tv_show)
          ])
        end

        it "creates 2 favorites for the demo user" do
          expect(CreateDemoUser).to(
            receive(:build_favorites).with(demo_user).and_call_original
          )
          service.create_favorites!

          expect(Favorite.count).to eq(2)
        end
      end
    end
  end

  describe "#follow!" do
    it "demo user follows the given user" do
      idol = double(:idol)
      expect(demo_user).to receive(:follow!).with(idol)
      service.follow!(idol)
    end
  end

  describe "#create_followers!" do
    let!(:demo_user) { create(:user) }

    it "creates 3 new users" do
      expect { service.create_followers! }.to change { User.count }.by(3)
    end

    it "stores the new users in its own followers array" do
      service.create_followers!
      expect(service.followers.length).to eq(3)
    end

    it "has the 3 new users follow the demo user" do
      service.create_followers!
      expect(demo_user.followers.length).to eq(3)
    end

    it "demo user follows 2 of the new users" do
      expect(service).to receive(:follow!).twice
      service.create_followers!
    end
  end

  describe "#set_up_feed_activity!" do
    let(:tv_shows) do
      (0...6).to_a.map { create(:tv_show) }
    end

    it "creates a random assortment of activities for its followers" do
      follower = create(:user)
      allow(service).to receive(:followers).and_return([follower])
      allow(CreateDemoUser).to receive(:tv_shows).and_return(tv_shows)

      service.set_up_feed_activity!

      expect(follower.watchlists).not_to be_empty
      expect(follower.favorites).not_to be_empty
    end

    it "sets the created_at times for the activities to random times" do
      activities = [Favorite.new, Favorite.new].each do |fav|
        allow(fav).to receive(:save!)
      end

      allow(service).to receive(:follower_activities).and_return(activities)

      service.set_up_feed_activity!

      expect(activities.map(&:created_at).uniq.length).not_to eq(1)
    end
  end

  describe "#set_up_follows!" do
    it "creates follows for the demo user" do
      expect(service).to receive(:create_followers!)
      service.set_up_follows!
    end

    it "sets up feed activity for the demo user" do
      expect(service).to receive(:set_up_feed_activity!)
      service.set_up_follows!
    end
  end

  describe "#go!" do
    it "creates watchlists for the demo user" do
      expect(service).to receive(:create_watchlists!)
      service.go!
    end

    it "creates favorites for the demo user" do
      expect(service).to receive(:create_favorites!)
      service.go!
    end

    it "sets up follows for the demo user" do
      expect(service).to receive(:set_up_follows!)
      service.go!
    end

    it "returns the demo user" do
      expect(service.go!).to eq(demo_user)
    end
  end
end
