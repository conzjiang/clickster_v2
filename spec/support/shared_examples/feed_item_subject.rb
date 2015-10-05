shared_examples "a feed item subject" do
  before { create(:follow, idol_id: user.id, follower_id: follower.id) }

  it "has many feed items" do
    item_subject = create(subject, user_id => user.id)
    feed_items = item_subject.feed_items

    expect(item_subject).to respond_to(:feed_items)
    expect(feed_items).to be_an(ActiveRecord::Associations::CollectionProxy)
  end

  context "after save" do
    it "creates feed items for its user's followers after save" do
      expect do
        create(subject, user_id => user.id)
      end.to change { follower.feed_items.count }.by(1)
    end

    it "doesn't create any new feed items if watcher has no followers" do
      Follow.destroy_all
      activity = create(subject, user_id => user.id)

      if subject == :follow
        expect(activity.feed_items.count).to eq(1)
      else
        expect(activity.feed_items).to be_empty
      end
    end

    it "destroys associated feed items on destruction" do
      new_subject = create(subject, user_id => user.id)
      new_subject.destroy!
      expect(new_subject.feed_items).to be_empty
    end
  end
end