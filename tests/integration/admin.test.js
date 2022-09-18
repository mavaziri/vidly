const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../../models/user");

let server;

describe("admin middleware", () => {
  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
  });

  let token;
  let user;
  let id;

  const exec = async () => {
    return await request(server)
      .delete(`/api/genres/${id}`)
      .set("x-auth-token", token)
      .send();
  };

  afterAll(async () => await mongoose.disconnect());

  it("should return 403 if user is not admin", async () => {
    user = { _id: mongoose.Types.ObjectId(), isAdmin: false };
    id = user._id;

    token = new User(user).generateAuthToken();

    const res = await exec();

    expect(res.status).toBe(403);
  });

  it("should delete the genre if user is admin", async () => {
    user = { _id: mongoose.Types.ObjectId(), isAdmin: true };
    id = user._id;

    token = new User(user).generateAuthToken();

    const res = await exec();

    expect(res.body).not.toBeNull();
  });
});
