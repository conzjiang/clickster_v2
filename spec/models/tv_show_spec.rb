describe TvShow do
  subject(:tv_show) { create(:tv_show) }

  it { should validate_presence_of(:title) }
  it { should belong_to(:admin) }
end
