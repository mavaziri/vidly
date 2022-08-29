const config = require("config");
const jwt = require("jsonwebtoken");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId(),
      //   _id: new mongoose.Types.ObjectId().toHexString(), // We don't need using toHexString() anymore
      isAdmin: true,
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(decoded).toMatchObject(payload);
  });
});
