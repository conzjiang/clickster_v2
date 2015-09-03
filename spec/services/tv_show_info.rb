describe TvShowInfo do
  it "initializes with a tv_show and a current_user_id" do
    tv_show = double(:tv_show)
    tv_show_info = TvShowInfo.new(tv_show, 1)

    expect(tv_show_info.tv_show).to eq(tv_show)
    expect(tv_show_info.current_user_id).to eq(1)
  end

  describe "#watching_idols_count" do
    it "initializes as zero" do
      expect(TvShowInfo.new(0, 1).watching_idols_count).to be_zero
    end
  end

  describe "#watchers" do
    it "returns nil if no current_user_id" do
      expect(TvShowInfo.new(0, nil).watchers).to be_nil
    end

    context "when signed in" do
      let(:tv_show) { create(:tv_show) }
      let(:current_user) { create(:user) }
      let(:tv_show_info) { TvShowInfo.new(tv_show, current_user.id) }

      let(:watchers) do
        [
          create(:user),
          create(:user),
          current_user
        ]
      end

      before :each do
        2.times { create(:user) }

        watchers.each do |watcher|
          create(:watchlist, tv_show: tv_show, watcher: watcher)
        end
      end

      it "returns all the watchers of the tv_show" do
        expect(tv_show_info.watchers.sort).to eq(watchers.sort)
      end

      it "first sorts it by the current_user" do
        expect(tv_show_info.watchers.first).to eq(current_user)
      end

      it "then sorts it by current_user's idols" do
        current_user.follow!(watchers.first)
        expect(tv_show_info.watchers.second).to eq(watchers.first)
      end
    end
  end
end
