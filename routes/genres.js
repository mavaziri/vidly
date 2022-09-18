const validateObjectId = require("../middleware/validateObjectId");
const asyncMiddleware = require("../middleware/async");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");
const { ValidateGenre, Genre } = require("../models/genre");
const express = require("express");
const app = express();
const router = express.Router();
// const debugHttp = require("debug")("http");

router.get("/", async (req, res) => {
  const genre = await Genre.find().sort({ name: 1 }).select({ name: 1 });
  res.send(genre);
});

router.post("/", [auth, validate(ValidateGenre)], async (req, res) => {
  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  res.send(genre);
});

router.put(
  "/:id",
  [auth, validateObjectId, validate(ValidateGenre)],
  async (req, res) => {
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
        },
      },
      { new: true }
    );

    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");

    res.send(genre);
  }
);

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

module.exports = router;
