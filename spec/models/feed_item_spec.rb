describe FeedItem do
  it { should validate_presence_of(:user_id) }
  it { should validate_presence_of(:message) }
  it { should belong_to(:user) }
  it { should belong_to(:idol) }
  it { should belong_to(:subject) }
end