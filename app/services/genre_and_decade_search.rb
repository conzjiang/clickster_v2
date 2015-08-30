class GenreAndDecadeSearch
  CURRENT_STATUSES = [0, 1]

  attr_reader :params
  attr_writer :tv_results

  def initialize(params)
    @params = params
  end

  def go
    genre_search
    decade_search
    current_search

    self
  end

  def tv_results
    @tv_results ||= TvShow.all
  end

  def genre_search
    return unless params[:genres]
    self.tv_results = tv_results.genre_search(params[:genres])
  end

  def decade_search
    return unless params[:decades]
    self.tv_results = tv_results.decade_search(params[:decades])
  end

  def current_search
    return unless params[:current]
    self.tv_results = tv_results.where(status: CURRENT_STATUSES)
  end
end
