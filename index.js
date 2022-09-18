// const startupDebugger = require("debug")("app:startup");
// const dbDebugger = require("debug")("app:db");
// const morgan = require("morgan");
const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging");
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

// Promise.reject(new Error("Test unhandledRejection"))
// .then(() =>
//   console.log("Done")
// );

// console.log(`app: ${app.get("env")}`);

// if (app.get("env") === "development") {
//   app.use(morgan("tiny"));
//   startupDebugger("Morgan enabled...");
// }
// // Db info
// dbDebugger("DB informations...");

// app.use(morgan("tiny"));

// PORT
const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
