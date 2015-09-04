describe Watchers do
  it "initializes with params" do
    get_watchers = Watchers.new({})
    expect(get_watchers.params).to eq({})
  end

  describe "#watching_idols_count" do
    it "initializes as zero" do
      expect(Watchers.new(0).watching_idols_count).to be_zero
    end
  end

  describe "#watchers" do
    let(:tv_show) { create(:tv_show) }
    let(:current_user) { create(:user) }

    let(:plan_to_watch) do
      [
        create(:user),
        create(:user),
        current_user
      ]
    end

    let(:get_watchers) do
      Watchers.new({
        status: "Plan to Watch",
        id: tv_show.id,
        current_user_id: current_user.id
      })
    end

    before :each do
      2.times do
        create(:watchlist, {
          tv_show: tv_show,
          watcher: create(:user),
          status: "Watching"
        })
      end

      plan_to_watch.each do |watcher|
        create(:watchlist, {
          tv_show: tv_show,
          watcher: watcher,
          status: "Plan to Watch"
        })
      end
    end

    it "returns the tv_show watchers if watchlist status" do
      expect(get_watchers.watchers.sort).to eq(plan_to_watch.sort)
    end

    it "returns the tv_show favorites if favorites status" do
      get_watchers = Watchers.new({
        status: "Favorites",
        id: tv_show.id
      })

      create(:favorite, favoriter: current_user, tv_show: tv_show)

      expect(get_watchers.watchers).to eq([current_user])
    end

    context "when signed in" do
      it "first sorts the watchers by the current_user" do
        expect(get_watchers.watchers.first).to eq(current_user)
      end

      it "then sorts them by current_user's idols" do
        idol = plan_to_watch.first
        current_user.follow!(idol)
        expect(get_watchers.watchers.second).to eq(idol)
      end

      it "sets the watching_idols_count to the number of idol watchers" do
        current_user.follow!(plan_to_watch.first)

        expect do
          get_watchers.watchers
        end.to change { get_watchers.watching_idols_count }.by(1)
      end
    end
  end
end
