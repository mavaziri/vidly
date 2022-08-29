const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 5, maxLength: 50 },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 1024,
  },
  isAdmin: Boolean,
  // roles: [],
  // operations: [],
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function ValidateUser(user) {
  const pattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
  const schema = Joi.object({
    name: Joi.string().alphanum().min(5).max(55).required(),
    email: Joi.string().min(5).max(255).email().required(),
    isAdmin: Joi.boolean(),
    password: Joi.string().regex(pattern).required(),
    repeat_password: Joi.ref("password"),

    access_token: [Joi.string(), Joi.number()],
  })
    .xor("password", "access_token")
    .with("password", "repeat_password");

  this.user = user;
  this.validator = function () {
    return schema.validate(this.user);
  };
}

exports.validate = ValidateUser;
exports.User = User;
