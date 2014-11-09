describe User do
  subject { create(:user) }
  
  [:email, :username].each do |attribute|
    it { should validate_presence_of(attribute) }
    it { should validate_uniqueness_of(attribute) }
  end
end
