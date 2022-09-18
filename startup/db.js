const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  const db = config.get("db");
  mongoose.connect(db)
  .then(() => winston.info(`Connected to ${db}...`));
};

// module.exports = {
//   mongoose,
//   connect: () => {
//     mongoose.Promise = Promise;
//     const db = config.get("db");
//     mongoose.connect(db)
//     .then(() => winston.info(`Connected to ${db}...`));
//   },
//   disconnect: (done) => {
//     mongoose.disconnect(done);
//   },
// };
