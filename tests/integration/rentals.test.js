const mongoose = require("mongoose");
const request = require("supertest");
const { User } = require("../../models/user");
const { Rental } = require("../../models/rental");

let server;

describe("/api/rentals", () => {
  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
    await Rental.deleteOne();
  });

  afterAll(async () => await mongoose.disconnect());

  describe("POST /", () => {
    let token;

    let customer;
    let movie;

    const exec = async () => {
      return await request(server)
        .post("/api/rentals")
        .set("x-auth-token", token)
        .send(customer, movie);
    };

    beforeEach(async () => {
      token = new User().generateAuthToken();
      customer = {
        name: "Customer1",
        phone: "12334",
      };
      movie = {
        title: "Movie1",
        dailyRentalRate: 2,
      };
    });

    it("should retun 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should retun 400 if customer's name is less than 5 characters", async () => {
      customer.name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should retun 400 if customer's name is more than 50 characters", async () => {
      customer.name = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should retun 400 if customer's phone is less than 5 characters", async () => {
      customer.phone = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });
    it("should retun 400 if customer's phone is more than 50 characters", async () => {
      customer.phone = new Array(52).join("5");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should retun 400 if movie's title is less than 5 characters", async () => {
      movie.title = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should retun 400 if movie's title is more than 50 characters", async () => {
      movie.title = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should retun 400 if movie's dailyRentalRate is less than 0", async () => {
      movie.dailyRentalRate = -1;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should retun 400 if movie's dailyRentalRate is more than 255", async () => {
      movie.dailyRentalRate = 256;

      const res = await exec();

      expect(res.status).toBe(400);
    });
  });

//   describe("PUT /", () => {
//     let token;
//     let rental;
//     let newName;
//     let newPhone;
//     let newTitle;
//     let newDailyRentalRate;

//     const exec = async () => {
//       return await request(server)
//         .put(`/api/rentals/${id}`)
//         .set("x-auth-token", token)
//         .send(rental);
//     };

//     beforeEach(async () => {
//       token = new User().generateAuthToken();
//       newName = "Customer1";
//       newPhone = "12345";
//       newTitle = "Movie1";
//       newDailyRentalRate = 2;

//       rental = new Rental({
//         customer: {
//           name: newName,
//           phone: newPhone,
//         },
//         movie: {
//           title: newTitle,
//           dailyRentalRate: newDailyRentalRate,
//         },
//       });
//       await rental.save();
//     });
//   });

//   it("should retun 401 if client is not logged in", async () => {
//     token = "";

//     const res = await exec();

//     expect(res.status).toBe(401);
//   });
});
