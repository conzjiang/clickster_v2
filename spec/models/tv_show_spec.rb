describe TvShow do
  subject(:tv_show) { create(:tv_show) }

  it { should validate_presence_of(:title) }
  it { should belong_to(:admin) }
  it { should have_many(:tv_decades) }
  it { should have_many(:tv_genres) }

  describe "#set_decades" do
    it "creates associated TV decades when setting start & end years" do
      tv_show.start_year = 1999
      tv_show.end_year = 2010
      tv_show.set_decades
      tv_show.save!

      expect(tv_show.tv_decades).not_to be_empty
      expect(tv_show.decades).to eq(["90", "00", "10"])
    end

    it "assigns decades up to the current year if no end year is set" do
      Timecop.travel(Time.zone.local(2014, 1, 1))
      tv_show.start_year = 1999
      tv_show.set_decades
      tv_show.save!

      expect(tv_show.decades).to eq(["90", "00", "10"])
    end

    it "resets all decades when changing start or end years" do
      tv_show.start_year = 1999
      tv_show.end_year = 2010
      tv_show.set_decades
      tv_show.save!

      tv_show.start_year = 1980
      tv_show.end_year = 1990
      tv_show.set_decades
      tv_show.save!

      expect(tv_show.decades).to eq(["80", "90"])
    end
  end
end
