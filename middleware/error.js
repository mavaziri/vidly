const winston = require("winston");
// const { dbLogger, systemFileLogger } = require("../startup/logging");

module.exports = function (err, req, res, next) {
  // winston.log('error', err.message) or
  // winston.error(err);  // Add err.message to logfile.log
  // mongoDbLogger.error("error", { meta: err });   // Add err.message to console
  winston.error(err.message, err);
  // winston.error(err.message, { meta: err });

  // dbLogger.log({
  //   level: "error",
  //   message: err.message,
  //   stack: err.stack,
  //   metadata: err.stack,
  // });

  // systemFileLogger.log({
  //   level: "error",
  //   message: err,
  // });

  res.status(500).send("Something failed");
};
