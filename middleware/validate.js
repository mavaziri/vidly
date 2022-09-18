module.exports = validate = (ValidatorFn) => {
  return (req, res, next) => {
    const result = new ValidatorFn(req.body);
    const { error } = result.validator();
    if (error)
     return res.status(400).send(error.details[0].message);

    next();
  };
};
