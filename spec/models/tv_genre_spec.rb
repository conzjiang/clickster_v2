describe TvGenre do
  it { should belong_to(:tv_show) }
  it { should define_enum_for(:genre) }
  it { should validate_uniqueness_of(:tv_show_id).scoped_to(:genre) }

  describe "::genres_list" do
    it "returns an array" do
      expect(TvGenre.genres_list).to be_an(Array)
    end

    it "returns the list of genre names" do
      expect(TvGenre.genres_list).to include("Comedy")
    end
  end

  describe "::get_ids" do
    it "returns the ids corresponding to genre names" do
      expect(TvGenre.get_ids(["Comedy", "Drama"])).to eq([0, 1])
    end

    it "doesn't return nil when genre doesn't exist" do
      expect(TvGenre.get_ids(["Birds", "Comedy"])).to eq([0])
    end
  end
end
