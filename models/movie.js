const { genreSchema } = require("../models/genre");
const Joi = require("joi");
const mongoose = require("mongoose");

// const movieSchema = new mongoose.Schema({
//   title: { type: String, required: true, minLength: 5, maxLength: 50 },
//   genre: Genre,
// });

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
      maxLength: 50,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
  })
);

function ValidateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });

  this.movie = movie;
  this.validator = function () {
    return schema.validate(this.movie);
  };
}

exports.Movie = Movie;
exports.ValidateMovie = ValidateMovie;
