const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../../models/user");
const { Customer } = require("../../models/customer");

let server;

describe("/api/customers", () => {
  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
    await Customer.deleteOne();
  });

  afterAll(async () => await mongoose.disconnect());

  describe("POST /", () => {
    let name;
    let isGold;
    let phone;
    let token;

    const exec = async () => {
      return await request(server)
        .post("/api/customers")
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(() => {
      name = "newCustomer";
      isGold = false;
      phone = "12345";
      token = new User().generateAuthToken();
    });

    it("should return 400 if name is less than 5 characters", async () => {
      name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if name is less than 50 characters", async () => {
      name = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if name is empty", async () => {
      name = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if isGold is not valid", async () => {
      isGold = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if phone is less than 5 characters", async () => {
      phone = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if phone is more than 50 characters", async () => {
      phone = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if phone is not valid", async () => {
      phone = false;

      const res = await exec();

      expect(res.status).toBe(400);
    });
  });

  describe("PUT /:id", () => {
    let newName;
    let newIsGold;
    let newPhone;
    let token;
    let id;
    let customer;

    const exec = async () => {
      return await request(server)
        .put(`/api/customers/${id}`)
        .set("x-auth-token", token)
        .send({ name: newName, isGold: newIsGold, phone: newPhone });
    };

    beforeEach(async () => {
      customer = new Customer({
        name: "customer1",
        isGold: false,
        phone: "12345",
      });
      await customer.save();

      token = new User().generateAuthToken();
      id = customer._id;
      newName = "newCustomer";
      newIsGold = true;
      newPhone = "987654";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if name is less than 5 characters", async () => {
      newName = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if name is more than 50 characters", async () => {
      newName = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if isGold is not valid", async () => {
      newIsGold = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if phone is not valid", async () => {
      newPhone = false;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if invalid id is passed", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if customer with the given id was not found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should update the customer if input is valid", async () => {
      await exec();

      const customerInDb = await Customer.findById(id);
      // console.log("RESPONSE", Object.keys(res.body));

      expect(customerInDb.name).toBe(newName);
    });
  });
});
