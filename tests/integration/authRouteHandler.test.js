const request = require("supertest");
const mongoose = require("mongoose");

let server;

describe("/api/auth", () => {
  let email;
  let password;
  let username;

  const exec = () => {
    return request(server).post("/api/auth").send({ email, password });
  };

  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
  });

  afterAll(async () => await mongoose.disconnect());

  describe("POST /", () => {
    // it("should return a token if user is logged in", () => {

    // });

    beforeEach(() => {
      email = "test1@gmail.com";
      password = "12345";
    });

    it("should return 400 if email is less than 5 characters", async () => {
      username = "test";
      email = `${username}@gmail.com`;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if email is more than 255 characters", async () => {
      username = new Array(257).join("a");
      email = `${username}@gmail.com`;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if email is not valid", async () => {
      email = `test`;

      const res = await exec();

      expect(res.status).toBe(400);
    });
  });
});
