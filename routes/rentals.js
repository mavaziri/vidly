const auth = require("../middleware/auth");
const { validate, Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const mongoose = require("mongoose");
const Transaction = require("mongoose-transactions");
const express = require("express");
const router = express.Router();

const transaction = new Transaction();

router.get("/", auth, async (req, res) => {
  const rental = await Rental.find().sort("-dateOut");

  res.send(rental);
});

router.post("/", auth, async (req, res) => {
  const result = new validate(req.body);
  const { error } = result.validator();
  if (error)
   return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer)
   return res.status(400).send("Invalid customer!");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie)
   return res.status(400).send("Invalid movie!");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock!");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    transaction.insert("Rental", rental);
    transaction.update(
      "Movie",
      { _id: movie._id },
      {
        $inc: { numberInStock: -1 },
      }
    );
    await transaction.run();

    res.send(rental);
  } catch (ex) {
    console.error(ex);
    await transaction.rollback().catch(console.error);
    transaction.clean();
    res.status(500).send("Something failed.");
  }
});

module.exports = router;
