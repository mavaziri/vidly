const auth = require("../middleware/auth");
const { Movie, ValidateMovie } = require("../models/movie");
const { Genre } = require("../models/genre");
const validate = require("../middleware/validate");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const movie = await Movie.find()
    .select("title  -_id")
    .populate("genre", "name -_id -__v");

  res.send(movie);
});

router.post("/", [auth, validate(ValidateMovie)], async (req, res) => {
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) 
  return res.status(400).send("Invalid genre!");

  const movie = new Movie({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
  });
  await movie.save();

  res.send(movie);
});

router.put("/:id", [auth, validate(ValidateMovie)], async (req, res) => {
  const genre = await Genre.findById(req.body.genreId);
  if (!genre)
   return res.status(400).send("Invalid genre!");

  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          numberInStock: req.body.numberInStock,
          dailyRentalRate: req.body.dailyRentalRate,
          genre: {
            _id: genre._id,
            name: genre.name,
          },
        },
      },
      { new: true }
    );

    res.send(movie);
  } catch {
    return res.status(404).send("The genre with the given ID was not found!");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    res.send(movie);
  } catch {
    return res.status(404).send("The genre with the given ID was not found!");
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    console.log("movie", movie);
    res.send(movie);
  } catch {
    return res.status(404).send("The genre with the given ID was not found!");
  }
});

module.exports = router;
