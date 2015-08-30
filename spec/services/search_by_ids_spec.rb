describe SearchByIds do
  it "initializes with params" do
    search = SearchByIds.new({ a: 1 })
    expect(search.params).to eq({ a: 1 })
  end

  describe "#tv_results" do
    before :each do
      create(:tv_show)
    end

    let(:matches) { [create(:tv_show), create(:tv_show)] }

    it "returns an empty array if no tv_ids param" do
      search = SearchByIds.new({})
      expect(search.tv_results).to eq([])
    end

    it "returns the TV shows with matching tv_ids" do
      search = SearchByIds.new({
        tv_ids: matches.map(&:id)
      })

      expect(search.tv_results).to eq(matches)
    end
  end

  describe "#user_results" do
    before :each do
      create(:user)
    end

    let(:matching_user) { create(:user) }
    let(:search) do
      SearchByIds.new({
        user_ids: [matching_user.id]
      })
    end

    it "returns an empty array if no user_ids param" do
      search = SearchByIds.new({})
      expect(search.user_results).to eq([])
    end

    it "returns the users with matching user_ids" do
      expect(search.user_results).to eq([matching_user])
    end

    it "appends a watch_count attribute to the matching users" do
      expect(search.user_results.first.watch_count).to eq(0)
    end

    it "appends a favorite_count attribute to the matching users" do
      2.times { create(:favorite, favoriter: matching_user) }
      expect(search.user_results.first.favorite_count).to eq(2)
    end
  end
end
