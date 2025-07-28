/**
 * @fileoverview
 * Winston Logger Configuration.
 *
 * Provides a configured logger instance for logging across the app.
 * Logs are output to both console (with colorized levels) and a file (`logs/app.log`).
 */

const { createLogger, transports, format } = require('winston');
const path = require('path');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) =>
      `[${timestamp}] ${level.toUpperCase()}: ${message}`
    )
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
    new transports.File({ filename: path.join('logs', 'app.log') }),
  ],
});

module.exports = logger;
