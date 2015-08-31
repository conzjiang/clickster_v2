describe ValidatePassword do
  let(:validate) { ValidatePassword.new(1, 2) }

  describe "#initialize" do
    it "initializes with a current_user" do
      expect(validate.current_user).to eq(1)
    end

    it "initializes with params" do
      expect(validate.params).to eq(2)
    end
  end

  describe "#valid?" do
    it "is valid by default" do
      expect(validate).to be_valid
    end

    it "isn't valid when there's an error" do
      validate.error = 1
      expect(validate).not_to be_valid
    end
  end

  describe "#check_password" do
    let(:user) { create(:user, password: "123456") }

    it "returns true if password is correct" do
      validate = ValidatePassword.new(user, { password: "123456" })
      expect(validate.check_password).to eq(true)
    end

    context "incorrect password" do
      let(:validate) { ValidatePassword.new(user, { password: "12345" }) }

      it "returns false" do
        expect(validate.check_password).to eq(false)
      end

      it "sets an error" do
        expect { validate.check_password }.to change { validate.error }
      end
    end
  end

  describe "#confirm_new_password" do
    it "returns true if new password matches password confirmation" do
      validate = ValidatePassword.new(nil, {
        new_password: "abc",
        password_confirmation: "abc"
      })

      expect(validate.confirm_new_password).to eq(true)
    end

    context "new password doesn't match confirmation" do
      let(:validate) do
        ValidatePassword.new(nil, {
          new_password: "abc",
          password_confirmation: "2343"
        })
      end

      it "returns false" do
        expect(validate.confirm_new_password).to eq(false)
      end

      it "sets an error" do
        expect { validate.confirm_new_password }.to change { validate.error }
      end
    end
  end

  describe "#set_password" do
    it "sets the current_user's password to the new password" do
      current_user = create(:user)
      validate = ValidatePassword.new(current_user, { new_password: "abcd" })
      validate.set_password

      expect(current_user.password).to eq("abcd")
    end
  end

  describe "#go" do
    let(:validate) { ValidatePassword.new(0, 1) }

    it "sets password if password is correct and confirmed" do
      allow(validate).to receive(:check_password) { true }
      allow(validate).to receive(:confirm_new_password) { true }

      expect(validate).to receive(:set_password)
      validate.go
    end

    it "doesn't set password if password isn't correct or confirmed" do
      allow(validate).to receive(:check_password) { true }
      allow(validate).to receive(:confirm_new_password) { false }

      expect(validate).not_to receive(:set_password)
      validate.go
    end

    it "returns self" do
      allow(validate).to receive(:check_password) { true }
      allow(validate).to receive(:confirm_new_password) { false }

      expect(validate.go).to eq(validate)
    end
  end
end
