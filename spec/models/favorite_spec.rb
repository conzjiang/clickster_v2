describe Favorite do
  subject(:favorite) { create(:favorite) }

  it { should validate_presence_of(:tv_show) }
  it { should belong_to(:tv_show) }
  it { should belong_to(:favoriter) }

  it "validates scoped uniqueness of favoriter vs. tv_show" do
    bad_favorite = build(
      :favorite,
      favoriter: favorite.favoriter,
      tv_show: favorite.tv_show
    )

    expect(bad_favorite).not_to be_valid
    expect(bad_favorite.errors.keys).to include(:favoriter)
  end
end