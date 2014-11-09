describe User do
  subject(:user) { create(:user) }

  [:email, :username].each do |attribute|
    it { should validate_presence_of(attribute) }
    it { should validate_uniqueness_of(attribute) }
  end

  it "should generate session token upon initialization" do
    expect(user.session_token).not_to be_nil
  end

  describe "#password" do
    it "should validate length of 6" do
      expect(build(:user, password: "abcde")).not_to be_valid
    end

    it "should allow nil" do
      expect(build(:user, password: nil)).to be_valid
    end

    it "should automatically generate password_digest" do
      expect(user.password_digest).not_to be_nil
    end
  end
end
