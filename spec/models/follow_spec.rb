describe Follow do
  let(:user) { create(:user) }

  it { should validate_presence_of(:follower) }
  it { should validate_presence_of(:idol) }
  it { should validate_scoped_uniqueness_of(:follower_id, :idol_id) }
  it { should belong_to(:follower) }
  it { should belong_to(:idol) }

  it_behaves_like "a feed item subject" do
    let(:subject) { :follow }
    let(:user_id) { :follower_id }
    let(:follower) { create(:user) }
  end
end