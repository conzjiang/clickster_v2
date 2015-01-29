describe Favorite do
  it { should validate_presence_of(:tv_show) }
  it { should belong_to(:tv_show) }
  it { should belong_to(:favoriter) }
  it { should validate_uniqueness_of(:favoriter_id).scoped_to(:tv_show_id) }
end