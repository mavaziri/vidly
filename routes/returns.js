const Joi = require("joi");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const moment = require("moment");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.post("/", [auth, validate(ValidateReturn)], async (req, res) => {
  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });
  if (!rental)
   return res.status(404).send("Rental not found");

  if (rental.dateReturned)
    return res.status(400).send("rental is already processed");

  rental.dateReturned = new Date();
  const rentalDays = moment().diff(rental.dateOut, "days");
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
  await rental.save();

  await Movie.findByIdAndUpdate(
    rental.movie._id,
    {
      $inc: { numberInStock: 1 },
    },
    { new: true }
  );

  return res.status(200).send(rental);
});

function ValidateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  this.req = req;
  this.validator = function () {
    return schema.validate(this.req);
  };
}

module.exports = router;
