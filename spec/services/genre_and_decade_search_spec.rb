describe GenreAndDecadeSearch do
  describe "#initialize" do
    let(:search) { GenreAndDecadeSearch.new({ a: 1 }) }

    it "initializes with params" do
      expect(search.params).to eq({ a: 1 })
    end

    it "initializes tv_results with all TV shows" do
      tv_show = create(:tv_show)
      expect(search.tv_results).to eq([tv_show])
    end
  end

  describe "#genre_search" do
    before :each do
      create(:tv_show, with_genres: [2])
    end

    it "finds the TV shows of the matching genres" do
      search = GenreAndDecadeSearch.new({
        genres: [0, 1]
      })

      matching_show = create(:tv_show, with_genres: [0])
      search.genre_search

      expect(search.tv_results).to eq([matching_show])
    end

    it "doesn't do anything if no genre params" do
      search = GenreAndDecadeSearch.new({})
      expect { search.genre_search }.not_to change { search.tv_results }
    end
  end

  describe "#decade_search" do
    before :each do
      create(:tv_show, with_decades: [2])
    end

    it "finds the TV shows of the matching decades" do
      search = GenreAndDecadeSearch.new({
        decades: [0, 1]
      })

      matching_show = create(:tv_show, with_decades: [1])
      search.decade_search

      expect(search.tv_results).to eq([matching_show])
    end

    it "doesn't do anything if no decade params" do
      search = GenreAndDecadeSearch.new({})
      expect { search.decade_search }.not_to change { search.tv_results }
    end
  end

  describe "#current_search" do
    before :each do
      create(:tv_show)
    end

    it "finds the current TV shows if current param" do
      search = GenreAndDecadeSearch.new({
        current: true
      })

      matching_show = create(:tv_show, status: 0)
      search.current_search

      expect(search.tv_results).to eq([matching_show])
    end

    it "does nothing if no current param" do
      search = GenreAndDecadeSearch.new({
        current: false
      })

      expect { search.current_search }.not_to change { search.tv_results }
    end
  end

  describe "#go" do
    let!(:matches) do
      [
        create(:tv_show, with_genres: [1], with_decades: [1]),
        create(:tv_show, with_genres: [1], with_decades: [1])
      ]
    end

    before :each do
      create(:tv_show, with_genres: [1], with_decades: [2], status: 0)
      create(:tv_show)
    end

    it "finds the TV shows that match all the parameters given" do
      search = GenreAndDecadeSearch.new({
        genres: [1],
        decades: [1]
      })

      search.go

      expect(search.tv_results.sort).to eq(matches.sort)
    end

    it "returns self" do
      search = GenreAndDecadeSearch.new({})
      expect(search.go).to eq(search)
    end
  end
end
