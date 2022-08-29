const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 5, maxLengh: 50 },
});

const Genre = mongoose.model("Genre", genreSchema);

function ValidateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(5).max(50).required(),
  });

  this.genre = genre;
  this.validator = function () {
    return schema.validate(this.genre);
  };
}

exports.Genre = Genre;
exports.ValidateGenre = ValidateGenre;
exports.genreSchema = genreSchema;
