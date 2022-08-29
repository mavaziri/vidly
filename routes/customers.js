const auth = require("../middleware/auth");
const { Customer, validate } = require("../models/customer");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const customer = await Customer.find()
    .sort({ name: 1 })
    .select({ name: 1, phone: 1 });

  res.send(customer);
});

router.post("/", auth, async (req, res) => {
  const result = new validate(req.body);
  const { error } = result.validator();
  if (error)
   return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  await customer.save();

  res.send(customer);
});

router.put("/:id", auth, async (req, res) => {
  try {
    const result = new validate(req.body);
    const { error } = result.validator();
    if (error)
     return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone,
      },
      { new: true }
    );

    res.send(customer);
  } catch {
    return res
      .status(404)
      .send("The customer with the given ID was not found!");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    res.send(customer);
  } catch {
    return res
      .status(404)
      .send("The customer with the given ID was not found!");
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.send(customer);
  } catch {
    return res
      .status(404)
      .send("The customer with the given ID was not found!");
  }
});

module.exports = router;
