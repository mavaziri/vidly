const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {});

router.post("/", async (req, res) => {
  const result = new Validate(req.body);
  const { error } = result.validator();
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();
  res.send(token);
});

function Validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(255).required(),
  });

  this.req = req;
  this.validator = function () {
    return schema.validate(this.req);
  };
}

module.exports = router;
