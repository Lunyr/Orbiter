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
import os from 'os';
import pjson from '../../../package.json';
import bunyan from 'bunyan';
import { default as settings } from '../../shared/defaults';
import Raven from 'raven';

if (!settings.isDevelopment && settings.privacy.errorReporting) {
  Raven.config(settings.sentry.endpoint, {
    name: os.hostname(),
    projectId: pjson.name,
    release: pjson.version,
    environment: settings.isDevelopment ? 'development' : 'production',
  }).install((err, initialErr, eventId) => {
    console.log(err, initialErr, 'Error configuring sentry');
    process.exit(1);
  });
}

/**
 * The general logger, that generally shouldn't be used except for root level
 * components or edge cases.
 */
export const log = bunyan.createLogger({
  name: 'Lunyr-Services',
  level: settings.logging.logLevel,
});

log.info('logger initialized.');

/**
 * getLogger returns a logger that can be used in the `name`ed module.
 * @param {string} The name of the module the logger is for
 * @return {Logger} The Logger
 */
export const getLogger = (name) => {
  return log.child({ module: name });
};

export { Raven };
