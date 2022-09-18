const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: { type: String, required: true, minLength: 5, maxLength: 50 },
    isGold: { type: Boolean, default: false },
    phone: { type: String, required: true, minLength: 5 },
  })
);

function ValidateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
    phone: Joi.string().min(5).max(50).required(),
  });

  this.customer = customer;
  this.validator = function () {
    return schema.validate(this.customer);
  };
}

exports.Customer = Customer;
exports.ValidateCustomer = ValidateCustomer;
