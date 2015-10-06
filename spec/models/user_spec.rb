describe User do
  subject(:user) { create(:user) }

  [:email, :username].each do |attribute|
    it { should validate_presence_of(attribute) }
  end

  it { should validate_uniqueness_of(:email) }
  it { should have_many(:tv_shows) }
  it { should have_many(:watchlists) }
  it { should have_many(:watchlist_shows) }
  it { should have_many(:favorites) }
  it { should have_many(:favorite_shows) }
  it { should have_many(:follows) }
  it { should have_many(:idols) }
  it { should have_many(:followings) }
  it { should have_many(:followers) }
  it { should have_many(:feed_items) }

  describe "#username" do
    it "doesn't validate length if facebook user" do
      allow(user).to receive(:facebook_user?) { true }
      user.username = "a" * (User::MAX_USERNAME_LENGTH + 1)

      expect(user).to be_valid
    end

    it "validates minimum length of 3" do
      user.username = "to"
      expect(user).not_to be_valid

      user.username = "too"
      expect(user).to be_valid
    end

    it "validates maximum length of #{User::MAX_USERNAME_LENGTH}" do
      # max length currently = 11
      user.username = "constanceeee"
      expect(user).not_to be_valid

      user.username = "constanceee"
      expect(user).to be_valid
    end

    context 'uniqueness' do
      let!(:conz) { create(:user, username: "conz") }
      let(:conz_dup) { build(:user, username: "conz") }

      it "validates uniqueness if not a facebook user" do
        allow(conz_dup).to receive(:facebook_user?) { false }
        expect(conz_dup).not_to be_valid
      end

      it "doesn't validates uniqueness if facebook user" do
        allow(conz_dup).to receive(:facebook_user?) { true }
        expect(conz_dup).to be_valid
      end
    end
  end

  describe "#ensure_session_token" do
    it "generates session token upon initialization" do
      expect(user.session_token).not_to be_nil
    end
  end

  describe "#password" do
    it "validates length of 6" do
      expect(build(:user, password: "abcde")).not_to be_valid
    end

    it "allows nil" do
      expect(build(:user, password: nil)).to be_valid
    end

    it "automatically generates password digest" do
      expect(user.password_digest).not_to be_nil
    end
  end

  describe "::create_demo_user!" do
    it "creates a new user" do
      User.create_demo_user!
      expect(User.count).to eq(1)
    end

    it "generates username prefixed with `guest` if none given" do
      user = User.create_demo_user!
      expect(user.username).to match("guest")
    end

    it "generates a random password" do
      user = User.create_demo_user!
      expect(user.is_password?(nil)).to be false
    end

    it "uses attributes if given" do
      user = User.create_demo_user!({
        username: "username",
        password_digest: "abc"
      })

      expect(user.username).to eq("username")
      expect(user.password_digest).to eq("abc")
    end

    it "generates email as [username]@example.com" do
      user = User.create_demo_user!({
        username: "conz"
      })

      expect(user.email).to eq("conz@example.com")
    end
  end

  describe "::find_by_credentials" do
    it "searches by username" do
      found_user = User.find_by_credentials(user.username, user.password)
      expect(found_user).to eq(user)
    end

    it "searches by email" do
      found_user = User.find_by_credentials(user.email, user.password)
      expect(found_user).to eq(user)
    end

    it "returns nil if no matches" do
      found_user = User.find_by_credentials("qqqqqq", "qqqqqq")
      expect(found_user).to be_nil
    end
  end

  describe "::find_by_slug" do
    it "finds the user with the matching username and id if facebook user" do
      john = create(:user, username: "john blue", id: 12, uid: "abc")
      create(:user, username: "john-blue")

      expect(User.find_by_slug("john-blue-12")).to eq(john)
    end

    it "doesn't confuse username with hyphens as facebook user" do
      hyphen = create(:user, username: "conz-j-123")
      create(:user, username: "conz j")

      expect(User.find_by_slug("conz-j-123")).to eq(hyphen)
    end

    it "doesn't match id slug with non-facebook user" do
      burgers = create(:user, username: "burgers", id: 1)
      allow(burgers).to receive(:facebook_user?) { false }

      expect(User.find_by_slug("burgers-1")).to be_nil
    end

    it "returns nil if no match found" do
      create(:user)

      expect(User.find_by_slug("tttt-12")).to be_nil
    end
  end

  describe "::recently_active" do
    it "returns the users who have watchlist activity in the past day" do
      active_user = create(:user)
      not_active_user = create(:user)
      create(:watchlist, watcher: active_user)
      create(:watchlist, watcher: not_active_user, created_at: 2.days.ago)

      expect(User.recently_active).to eq([active_user])
    end

    it "can take a limit" do
      active_users = []

      5.times do
        user = create(:user)
        create(:watchlist, watcher: user)
        active_users << user
      end

      expect(User.recently_active(3).count).to eq(3)
    end
  end

  context "Verifying users with omniauth" do
    let(:params) do
      {
        uid: "abc",
        email: "abc@example.com",
        name: "Christopher Robin"
      }
    end

    describe "::find_by_omniauth_params" do
      let(:matching_user) { User.find_by_omniauth_params(params) }

      it "returns the user with the corresponding uid" do
        user = create(:user, uid: "abc")
        expect(matching_user).to eq(user)
      end

      it "returns the user with the corresponding email if uid not found" do
        user = create(:user, email: "abc@example.com")
        expect(matching_user).to eq(user)
      end

      it "updates the user with the given uid if user found with email" do
        user = create(:user, email: "abc@example.com")
        expect(matching_user.uid).to eq("abc")
      end

      it "returns nil if no matching uid or email" do
        user = create(:user)
        expect(matching_user).to be_nil
      end
    end

    describe "::create_from_omniauth_params!" do
      let(:new_user) { User.create_from_omniauth_params!(params) }

      it "creates a new user" do
        expect { new_user }.to change { User.count }.by(1)
      end

      it "gets its email, uid, and username from params" do
        expect(new_user.email).to eq(params[:email])
        expect(new_user.uid).to eq(params[:uid])
        expect(new_user.username).to eq(params[:name])
      end

      it "is assigned a temporary password" do
        expect(new_user.username).not_to be_nil
        expect(new_user.is_password?(nil)).to be false
      end
    end
  end

  describe "::with_watch_and_favorite_count" do
    let(:user_with_counts) { User.with_watch_and_favorite_count.find(user.id) }

    it "appends watch_count attribute to user" do
      expect(user_with_counts.watch_count).to eq(0)
    end

    it "appends favorite_count attribute to user" do
      2.times { create(:favorite, favoriter: user) }
      expect(user_with_counts.favorite_count).to eq(2)
    end
  end

  let(:tv_show) { create(:tv_show) }

  describe "#admins?" do
    it "returns true if current_user admins tv show" do
      admin_show = create(:tv_show, admin_id: user.id)
      expect(user.admins?(admin_show)).to be true
    end

    it "returns false if current_user doesn't admin tv show" do
      expect(user.admins?(tv_show)).to be false
    end
  end

  describe "#demo_user?" do
    it "returns true if username is guest_ & email is username@example.com" do
      user = User.new(username: "guest345", email: "guest345@example.com")
      expect(user).to be_demo_user
    end

    it "returns false if username & email don't match" do
      user = User.new(username: "guest325", email: "alksjkfjk@example.com")
      expect(user).not_to be_demo_user
    end
  end

  describe "#facebook_user?" do
    it "returns true if has a uid" do
      expect(User.new(uid: 1)).to be_facebook_user
    end

    it "returns false if doesn't have uid" do
      expect(User.new).not_to be_facebook_user
    end
  end

  describe "#favorite!" do
    it "creates a favorite for the given tv show" do
      user.favorite!(tv_show)

      expect(user.favorites).not_to be_empty
      expect(user.favorite_shows).to include(tv_show)
    end
  end

  describe "#follow!" do
    it "creates a follow that represents the user following the given user" do
      idol = create(:user)
      user.follow!(idol)

      expect(user.follows).not_to be_empty
      expect(user.idols).to include(idol)
      expect(idol.followers).to include(user)
    end
  end

  describe "#following?" do
    it "returns true if user is following other user" do
      idol = create(:user)
      create(:follow, follower_id: user.id, idol_id: idol.id)

      expect(user.following?(idol)).to be true
    end

    it "returns false if user is not following other user" do
      other_user = create(:user)
      create(:follow, follower_id: user.id)

      expect(user.following?(other_user)).to be false
    end
  end

  describe "#likes?" do
    it "returns true if user has favorited TV show" do
      create(:favorite, favoriter_id: user.id, tv_show_id: tv_show.id)

      expect(user.likes?(tv_show)).to be true
    end

    it "returns false if user has not favorited TV show" do
      create(:favorite, favoriter_id: user.id)

      expect(user.likes?(tv_show)).to be false
    end
  end

  describe "#listed?" do
    it "returns true if user has added TV show to watchlist" do
      create(:watchlist, watcher_id: user.id, tv_show_id: tv_show.id)

      expect(user.listed?(tv_show)).to be true
    end

    it "returns false if user has not added TV show to watchlist" do
      create(:watchlist, watcher_id: user.id)

      expect(user.listed?(tv_show)).to be false
    end
  end

  describe "#reset_session_token!" do
    it "generates a new session token" do
      original_token = user.session_token
      expect(user.reset_session_token!).not_to eq(original_token)
    end
  end

  describe "#sign_out!" do
    it "if demo user, destroys self" do
      allow(user).to receive(:demo_user?) { true }
      expect(user).to receive(:destroy!)
      user.sign_out!
    end

    it "if not, resets its session token" do
      expect(user).to receive(:reset_session_token!)
      user.sign_out!
    end
  end

  describe "#slug" do
    let(:user) { User.new(id: 12, username: 'Constance Jiang') }

    it "if facebook user, hyphenates username and appends id at the end" do
      allow(user).to receive(:facebook_user?) { true }
      expect(user.slug).to eq('Constance-Jiang-12')
    end

    it "if not, returns username" do
      allow(user).to receive(:facebook_user?) { false }
      expect(user.slug).to eq('Constance Jiang')
    end
  end

  describe "#watchlist_shows_with_statuses" do
    let!(:watchlist_shows) do
      (0..2).map do
        create(:watchlist, watcher: user, status: "Watching").tv_show
      end
    end

    before :each do
      create(:tv_show)
    end

    it "returns the user's watchlist shows" do
      expect(user.watchlist_shows_with_statuses).to eq(watchlist_shows)
    end

    it "appends a watch_status attribute to each TV show" do
      watchlist_show = user.watchlist_shows_with_statuses.first
      expect(watchlist_show.watch_status).to eq("Watching")
    end
  end

  describe "#destroy_followers_for_demo_user" do
    before :each do
      4.times { create(:user).follow!(user) }
    end

    it "does nothing if user isn't demo user" do
      user.destroy!

      expect(User.count).to eq(4)
    end

    it "destroys the first 3 followers if user is demo user" do
      allow(user).to receive(:demo_user?).and_return(true)
      user.destroy!

      expect(User.count).to eq(1)
    end
  end

  describe "#deassociate_admin_tv_shows" do
    it "does nothing if user isn't admin" do
      tv_show = create(:tv_show)
      user.destroy!

      expect(tv_show.admin_id).not_to be_nil
    end

    it "sets its TV shows' admin_id's to nil upon destruction" do
      admin = create(:admin)
      create(:tv_show, admin: admin)
      admin.destroy!

      expect(TvShow.first.admin_id).to be_nil
    end
  end

  describe "#get_default_image" do
    it "returns the matching image_url if demo user's friend" do
      stub_const("CreateDemoUser::USERNAMES", %w(batman robin))
      batman = build(:user, username: "batman13")

      expect(batman.image.url).to eq('batman.jpg')
    end

    it "returns a guest image_url otherwise (id % 5 + 1)" do
      user = build(:user, id: 4)
      expect(user.image.url).to eq('guest5.jpg')
    end
  end
end
