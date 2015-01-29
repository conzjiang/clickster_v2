describe Follow do
  it { should validate_presence_of(:follower) }
  it { should validate_presence_of(:idol) }
  it { should validate_uniqueness_of(:follower_id).scoped_to(:idol_id) }
  it { should belong_to(:follower) }
  it { should belong_to(:idol) }
end