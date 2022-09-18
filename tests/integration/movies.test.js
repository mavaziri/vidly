const mongoose = require("mongoose");
const request = require("supertest");
const { Movie } = require("../../models/movie");
const { User } = require("../../models/user");

let server;

describe("/api/movies", () => {
  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
    await Movie.deleteOne();
  });

  afterAll(async () => await mongoose.disconnect());

  describe("POST /", () => {
    let token;
    let title;
    let numberInStock;
    let dailyRentalRate;
    let genre;

    const exec = async () => {
      return await request(server)
        .post("/api/movies")
        .set("x-auth-token", token)
        .send({ title, numberInStock, dailyRentalRate, genre });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      title = "Movie1";
      numberInStock = 2;
      dailyRentalRate = 2;
      genre = "Genre1";
    });

    it("should retun 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should retun 400 if title is less than 5 characters", async () => {
      title = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should retun 400 if title is less than 50 characters", async () => {
      title = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should retun 400 if numberInStock is not valid", async () => {
      numberInStock = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should retun 400 if numberInStock is less than 0", async () => {
      numberInStock = -1;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should retun 400 if dailyRentalRate is not valid", async () => {
      numberInStock = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should retun 400 if dailyRentalRate is less than 0", async () => {
      numberInStock = -1;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should retun 400 if genre is less than 5 characters", async () => {
      genre = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });
  });

  describe("PUT /", () => {
    let movie;
    let token;
    let newTitle;
    let newNumberInStock;
    let newDailyRentalRate;
    let newGenre;
    let id;

    const exec = async () => {
      return await request(server)
        .put(`/api/movies/${id}`)
        .set("x-auth-token", token)
        .send({
          title: newTitle,
          numberInStock: newNumberInStock,
          dailyRentalRate: newDailyRentalRate,
          genre: newGenre,
        });
    };

    beforeEach(async () => {
      token = new User().generateAuthToken();
      movie = new Movie({
        title: "Movie1",
        numberInStock: 2,
        dailyRentalRate: 2,
        genre: { name: "genre1" },
      });
      await movie.save();

      id = movie._id;
      newTitle = "newMovie1";
      newNumberInStock = 2;
      newDailyRentalRate = 2;
      newGenre = { name: "newGenre2" };
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if title is less than 5 characters", async () => {
      newTitle = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if title is less more 50 characters", async () => {
      newTitle = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if newNumberInStock is less than 0", async () => {
      newNumberInStock = -1;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if newDailyRentalRate is less than 0", async () => {
      newDailyRentalRate = -1;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is not valid", async () => {
      newGenre = { name: false };

      const res = await exec();

      expect(res.status).toBe(400);
    });
  });
});
