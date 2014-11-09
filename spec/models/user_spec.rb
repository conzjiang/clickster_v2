describe User do
  subject(:user) { create(:user) }

  [:email, :username].each do |attribute|
    it { should validate_presence_of(attribute) }
    it { should validate_uniqueness_of(attribute) }
  end

  describe "#ensure_session_token" do
    it "should generate session token upon initialization" do
      expect(user.session_token).not_to be_nil
    end
  end

  describe "::find_by_credentials" do
    it "can search by username" do
      found_user = User.find_by_credentials(user.username, user.password)
      expect(found_user).to eq(user)
    end

    it "can search by email" do
      found_user = User.find_by_credentials(user.email, user.password)
      expect(found_user).to eq(user)
    end

    it "returns nil if no matches" do
      found_user = User.find_by_credentials("qqqqqq", "qqqqqq")
      expect(found_user).to be_nil
    end
  end

  describe "#password" do
    it "should validate length of 6" do
      expect(build(:user, password: "abcde")).not_to be_valid
    end

    it "should allow nil" do
      expect(build(:user, password: nil)).to be_valid
    end

    it "should automatically generate password digest" do
      expect(user.password_digest).not_to be_nil
    end
  end

  describe "#reset_session_token!" do
    it "should generate a new session token" do
      original_token = user.session_token
      expect(user.reset_session_token!).not_to eq(original_token)
    end
  end
end
