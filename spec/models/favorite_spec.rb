describe Favorite do
  let(:favoriter) { create(:user) }

  it { should validate_presence_of(:tv_show) }
  it { should validate_scoped_uniqueness_of(:favoriter_id, :tv_show_id) }
  it { should belong_to(:tv_show) }
  it { should belong_to(:favoriter) }

  it_behaves_like "a feed item subject" do
    let(:subject) { :follow }
    let(:user_id) { :follower_id }
    let(:follower) { create(:user) }
    let(:user) { favoriter }
  end
end