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

    it "validates maximum length of 12" do
      user.username = "constanceeeee"
      expect(user).not_to be_valid

      user.username = "constanceeee"
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

  describe "::find_or_create_by_omniauth_params" do
    let(:omniauth_hash) do
      {
        "uid" => "abc",
        "info" => {
          "email" => "abc@example.com",
          "nickname" => "abcdef"
        }
      }
    end

    let(:matching_user) do
      User.find_or_create_by_omniauth_params(omniauth_hash)
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
        expect(matching_user.uid).to eq("abc")
        expect(matching_user.email).to eq("abc@example.com")
      end

      it "generates a random username based off the given nickname" do
        expect(matching_user.username).to match("abcdef")
      end

      it "generates a random password" do
        expect(matching_user.is_password?(nil)).to be false
      end
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
end
