describe FeedRecommendations do
  describe '#initialize' do
    let(:user) { double(:user) }
    let(:recs) { FeedRecommendations.new(user, 2) }

    it 'initializes with a current_user' do
      expect(recs.current_user).to eq(user)
    end

    it 'initializes with a limit' do
      expect(recs.limit).to eq(2)
    end

    it 'can initialize without a limit' do
      recs = FeedRecommendations.new(user)
      expect(recs.limit).to be_nil
    end
  end

  describe '#users' do
    let(:current_user) { double(:user) }
    let(:recs) { FeedRecommendations.new(current_user) }

    it 'returns the recently active users if there are any' do
      users = [
        double(:user),
        double(:user)
      ]
      allow(User).to receive(:recently_active).and_return(users)

      expect(recs.users).to eq(users)
    end

    it 'returns the most recently created users if no active users' do
      users = [
        create(:user),
        create(:user)
      ]
      allow(User).to receive(:recently_active).and_return([])

      expect(recs.users.sort).to eq(users.sort)
    end

    it 'returns recent users if the only active user is current_user' do
      allow(User).to receive(:recently_active).and_return([current_user])
      recent_user = create(:user)

      expect(recs.users).to eq([recent_user])
    end

    it 'limits the users to the given limit' do
      3.times { create(:user) }
      recs = FeedRecommendations.new(current_user, 1)

      expect(recs.users.length).to eq(1)
    end

    context "doesn't include current_user" do
      let!(:current_user) { create(:user) }
      let(:recs) { FeedRecommendations.new(current_user) }

      it 'if active users' do
        active_user = double(:user)
        allow(User).to receive(:recently_active).and_return([
          active_user,
          current_user
        ])

        expect(recs.users).not_to include(current_user)
      end

      it 'if recent users' do
        recent_user = create(:user)
        allow(recs).to receive(:active_users).and_return([])

        expect(recs.users).not_to include(current_user)
      end
    end
  end
end
