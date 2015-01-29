describe TvGenre do
  subject(:tv_genre) { create(:tv_genre) }

  it { should belong_to(:tv_show) }
  it { should define_enum_for(:genre) }

  it "validates scoped uniqueness of tv_show_id vs. genre" do
    bad_tv_genre = build(
      :tv_genre,
      tv_show_id: tv_genre.tv_show_id,
      genre: tv_genre.genre
    )

    expect(bad_tv_genre).not_to be_valid
  end

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
