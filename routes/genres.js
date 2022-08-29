const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { ValidateGenre, Genre } = require("../models/genre");
const express = require("express");
const router = express.Router();


router.get("/", async (req, res) => {
  const genre = await Genre.find().sort({ name: 1 }).select({ name: 1 });

  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const result = new ValidateGenre(req.body);
  const { error } = result.validator();
  if (error)
   return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const result = new ValidateGenre(req.body);
  const { error } = result.validator();
  if (error)
   return res.status(400).send(error.details[0].message);

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
});

router.delete("/:id", [auth, admin], async (req, res) => {
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
