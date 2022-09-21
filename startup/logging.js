const winston = require("winston");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

require("winston-mongodb");
require("express-async-errors");

const systemFileLogger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      level: "info",
      format: format.combine(
        format.colorize({
          all: true,
        })
      ),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "exception.log" }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: "rejections.log" }),
  ],
});

const dbLogger = createLogger({
  level: "error",
  format: combine(
    format.errors({ stack: true }), // log the full stack
    timestamp(), // get the time stamp part of the full log message
    printf(({ level, message, timestamp, stack }) => {
      // formating the log outcome to show/store
      return `${timestamp} ${level}: ${message} - ${stack}`;
    }),
    format.metadata() // >>>> ADD THIS LINE TO STORE the ERR OBJECT IN META field
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize({
          all: true,
        }),
        format.prettyPrint({ all: true })
      ),
    }), // show the full stack error on the console
    new winston.transports.File({
      // log full stack error on the file
      filename: "logfile.log",
      format: format.combine(
        format.colorize({
          all: true,
        })
      ),
    }),
    new winston.transports.MongoDB({
      db: "mongodb://localhost/vidly",
      // collection: "log",
      level: "error",
      storeHost: true,
      capped: true,
      // metaKey: 'meta'
    }),
  ],
});

winston.add(systemFileLogger);
// winston.add(dbLogger);

module.exports = systemFileLogger;
