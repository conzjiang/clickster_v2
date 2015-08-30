describe User do
  subject(:user) { create(:user) }

  [:email, :username].each do |attribute|
    it { should validate_presence_of(attribute) }
    it { should validate_uniqueness_of(attribute) }
  end

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

    it "uses username if given" do
      user = User.create_demo_user!("username")
      expect(user.username).to eq("username")
    end

    it "generates email as [username]@example.com" do
      user = User.create_demo_user!("conz")
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

  context "Verifying users with omniauth" do
    let(:params) do
      {
        id: "abc",
        email: "abc@example.com",
        first_name: "Christopher",
        last_name: "Robin"
      }
    end

    describe "::find_or_create_by_omniauth_params" do
      let(:matching_user) do
        User.find_or_create_by_omniauth_params(params)
      end

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

      context "if no matching user is found" do
        it "creates a new user with corresponding email and uid" do
          expect(User).to(
            receive(:create_from_omniauth_params!).
              with(params).and_call_original
          )

          expect(matching_user.uid).to eq("abc")
          expect(matching_user.email).to eq("abc@example.com")
        end
      end
    end

    describe "::create_from_omniauth_params!" do
      let(:new_user) { User.create_from_omniauth_params!(params) }

      it "creates a new user" do
        expect { new_user }.to change { User.count }.by(1)
      end

      it "gets its email and uid from params" do
        expect(new_user.email).to eq(params[:email])
        expect(new_user.uid).to eq(params[:id])
      end

      it "is assigned a temporary username and password" do
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
end
