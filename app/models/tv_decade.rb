class TvDecade < ActiveRecord::Base
  enum decade: %w(50 60 70 80 90 00 10)

  validates :tv_show_id, uniqueness: { scope: :decade }

  belongs_to :tv_show

  def self.decades_list
    decades.keys
  end
end
