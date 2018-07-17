/**
 * logger handles logging for Lunyr-Services
 * @module logger
 *
 * Usage
 * -----
 * Import `getLogger` and call it with the module name to get the logger
 *
 * const getLogger = require('./logger').getLogger;
 * let log = getLogger('myModule');
 * log.warn('my log');
 * log.debug('some stuff');
 */
const os = require('os');
const pjson = require('../package.json');
const bunyan = require('bunyan');
const lunyrConfig = require('../config/lunyrconfig')
const Raven = require('raven');
if (lunyrConfig.APP_ENV !== 'development') {
  Raven.config(
    lunyrConfig.sentry.endpoint,
    {
      name: os.hostname(),
      projectId: pjson.name,
      release: pjson.version,
      environment: lunyrConfig.APP_ENV,
    }
  ).install(
    (err, initialErr, eventId) => {
      console.log(err, initialErr, "Error configuring sentry");
      process.exit(1);
    }
  );
}

/**
 * The general logger, that generally shouldn't be used except for root level 
 * components or edge cases.
 */
let log = bunyan.createLogger({
  name: 'Lunyr-Services',
  level: lunyrConfig.logging.logLevel,
});

log.info("logger initialized.");

/**
 * getLogger returns a logger that can be used in the `name`ed module.
 * @param {string} The name of the module the logger is for
 * @return {Logger} The Logger
 */
function getLogger(name) {
  return log.child({ module: name })
}

module.exports = {
  Raven,
  log,
  getLogger
}