describe TvDecade do
  it { should define_enum_for(:decade) }
  it { should validate_uniqueness_of(:tv_show_id).scoped_to(:decade) }
  it { should belong_to(:tv_show) }

  describe "::decades_list" do
    it "returns an array" do
      expect(TvDecade.decades_list).to be_an(Array)
    end

    it "returns list of decades" do
      expect(TvDecade.decades_list).to include("00")
    end
  end

  describe "::get_ids" do
    it "returns the ids corresponding to decades" do
      expect(TvDecade.get_ids(["50", "60"])).to eq([0, 1])
    end

    it "doesn't return nil when decade doesn't exist" do
      expect(TvDecade.get_ids(["4", "50"])).to eq([0])
    end
  end
end
