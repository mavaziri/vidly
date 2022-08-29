const { User } = require("../../models/user");
const request = require("supertest");
const mongoose = require("mongoose");

let server;

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../index");
  });

  afterEach( () => {
     server.close();
  });

  let token;
  
  const exec = () => {
    return request(server)
    .post("/api/genres")
    .set("x-auth-token", token)
    .send({ name: "genre1" });
  };
  
  beforeEach(() => {
    token = new User().generateAuthToken();
  });
  
  afterAll(() => mongoose.disconnect());
  
  it("should return 401 if no token is provided", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid", async () => {
    token = "a";

    const res = await exec();

    expect(res.status).toBe(400);
  });
});
