//= require spec_helper

describe("Lists collection", function () {
  var lists;

  beforeEach(function () {
    lists = new Qliqster.Collections.Lists([], { user: { id: 1 }});
    lists.add([
      { tv_show_id: 1, status: "Completed" },
      { tv_show_id: 3, status: "Watching" }
    ]);
  });

  it("initializes with a user", function () {
    expect(lists.user.id).to.equal(1);
  });

  it("#getList returns the list item with the given tv_show_id", function () {
    expect(lists.getList(1).get("status")).to.equal("Completed");
  });

  describe("#send", function () {
    afterEach(function () {
      $.ajax.restore();
    });

    it("adds a list item if doesn't already exist", function () {
      var attrs = { tv_show_id: 5, status: "Watching" };
      sinon.stub($, "ajax").yieldsTo("success", attrs);
      lists.send(attrs);

      expect(lists).to.have.length(3);
    });

    it("removes a list item if already exists", function () {
      sinon.stub($, "ajax").yieldsTo("success", { destroyed: true });
      lists.send({ tv_show_id: 1 });

      expect(lists).to.have.length(1);
    });

    it("fires success callback along with adding/removing", function () {
      var success = sinon.spy();
      var attrs = { tv_show_id: 5, status: "Watching" };
      sinon.stub($, "ajax").yieldsTo("success", attrs);
      lists.send(attrs, { success: success });

      expect(success.calledOnce).to.be.true;
    });

    it("fires error callback if operation fails", function () {
      var error = sinon.spy();
      sinon.stub($, "ajax").yieldsTo("error");
      lists.send({}, { error: error });

      expect(error.calledOnce).to.be.true;
    });
  });
});