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

    it "validates maximum length of 10" do
      user.username = "constanceee"
      expect(user).not_to be_valid

      user.username = "constancee"
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
