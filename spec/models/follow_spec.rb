describe Follow do
  let(:user) { create(:user) }

  it { should validate_presence_of(:follower) }
  it { should validate_presence_of(:idol) }
  it { should validate_scoped_uniqueness_of(:follower_id, :idol_id) }
  it { should belong_to(:follower) }
  it { should belong_to(:idol) }
end