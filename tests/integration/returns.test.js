const moment = require("moment");
const request = require("supertest");
const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");
const { Movie, validate } = require("../../models/movie");
const mongoose = require("mongoose");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movie;
  let genreId;
  let rental;
  let token;
  let movieId;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../index");

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    genreId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: "12345",
      numberInStock: 0,
      dailyRentalRate: 2,
      genre: {
        _id: genreId,
        name: "67895",
      },
    });
    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });

  afterEach(async () => {
    await server.close();
    await Rental.deleteOne();
    await Movie.deleteOne();
  });

  afterAll(async () => await mongoose.disconnect());

  //   it("should work!", async () => {
  //     const result = await Rental.findById(rental._id);
  //     expect(result).not.toBeNull();
  //   });

  it("should returns 401 if client is not logged in", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if customerId is not provided", async () => {
    customerId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if movieId is not provided", async () => {
    movieId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental found for this customer/movie", async () => {
    await Rental.deleteOne();

    const res = await exec();

    expect(res.status).toBe(404);
  });

  it("should return 400 rental is already processed.", async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if valid request.", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should set the returnDate if the input is valid.", async () => {
    await exec();

    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;

    expect(diff).toBeLessThan(10 * 1000);
  });

  it("should set the rentalFee if the input is valid.", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();

    await exec();

    const rentalInDb = await Rental.findById(rental._id);

    expect(rentalInDb.rentalFee).toBe(14);
  });

  it("should increase the movieStock if the input is valid.", async () => {
    await exec();

    const movieInDb = await Movie.findById(movieId);
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });

  it("should return the rental if the input is valid.", async () => {
    const res = await exec();

    await Rental.findById(rental._id);

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie",
      ])
    );
  });
});
