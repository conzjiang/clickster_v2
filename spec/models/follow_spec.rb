describe Follow do
  subject(:follow) { create(:follow) }

  it { should validate_presence_of(:follower) }
  it { should validate_presence_of(:idol) }
  it { should belong_to(:follower) }
  it { should belong_to(:idol) }

  it "validates scoped uniqueness of follower_id vs. idol_id" do
    bad_follow = build(
      :follow,
      follower_id: follow.follower_id,
      idol_id: follow.idol_id
    )

    expect(bad_follow).not_to be_valid
    expect(bad_follow.errors.keys).to include(:follower_id)
  end
end