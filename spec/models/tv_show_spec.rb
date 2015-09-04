describe TvShow do
  subject(:tv_show) { create(:tv_show) }

  it { should validate_presence_of(:title) }
  it { should validate_presence_of(:image_url) }
  it { should belong_to(:admin) }
  it { should have_many(:tv_decades) }
  it { should have_many(:tv_genres) }

  it "validates that start year is after 1900" do
    tv_show.start_year = 1800

    expect(tv_show).not_to be_valid
    expect(tv_show.errors.full_messages).to include("Start year is invalid")
  end

  it "validates that start year must exist if end year is given" do
    tv_show.end_year = 2000

    expect(tv_show).not_to be_valid
    expect(tv_show.errors.full_messages).to include(
      "End year is invalid without start year"
    )
  end

  it "validates that end year cannot be before start year" do
    tv_show.start_year = 2000
    tv_show.end_year = 1999

    expect(tv_show).not_to be_valid
    expect(tv_show.errors.full_messages).to include(
      "End year cannot be before start year"
    )
  end

  it "validates that status is not current if end year is given" do
    tv_show.end_year = 2000
    tv_show.status = "Currently Airing"

    expect(tv_show).not_to be_valid
    expect(tv_show.errors.full_messages).to include(
      "Status cannot be Current if series has ended"
    )
  end

  describe "#genres=" do
    it "creates associated TV genres" do
      tv_show.genres = ["Comedy", "Romance"]
      tv_show.save!

      expect(tv_show.tv_genres).not_to be_empty
      expect(tv_show.genres).to eq(["Comedy", "Romance"])
    end

    it "resets genres" do
      tv_show.genres = ["Comedy", "Romance"]
      tv_show.save!

      tv_show.genres = ["Drama"]
      tv_show.save!

      expect(tv_show.genres(true)).to eq(["Drama"])
    end
  end

  describe "#set_decades" do
    it "creates associated TV decades when setting start & end years" do
      tv_show.start_year = 1999
      tv_show.end_year = 2010
      tv_show.save!

      expect(tv_show.tv_decades).not_to be_empty
      expect(tv_show.decades).to eq(["90", "00", "10"])
    end

    it "assigns decades up to the current year if no end year is set" do
      Timecop.travel(Time.zone.local(2014, 1, 1))
      tv_show.start_year = 1999
      tv_show.save!

      expect(tv_show.decades).to eq(["90", "00", "10"])
    end

    it "resets all decades when changing start or end years" do
      tv_show.start_year = 1999
      tv_show.end_year = 2010
      tv_show.save!

      tv_show.start_year = 1980
      tv_show.end_year = 1990
      tv_show.save!

      expect(tv_show.decades(true)).to eq(["80", "90"])
    end
  end

  describe "#watch_counts" do
    it "returns a hash of statuses (including Favorites) and # of watchers" do
      tv_show = create(:tv_show)
      create(:watchlist, tv_show: tv_show, status: "Watching")
      create(:favorite, tv_show: tv_show)

      expect(tv_show.watch_counts).to eq({
        "Watching" => 1,
        "Plan to Watch" => 0,
        "Completed" => 0,
        "Dropped" => 0,
        "Favorites" => 1
      })
    end
  end
end
