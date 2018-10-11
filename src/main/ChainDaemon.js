import { ipcMain } from 'electron';
import path from 'path';
import { fork, execSync, spawn } from 'child_process';
import eventsQueue from '../lib/queuelite';
import { getLogger } from '../lib/logger';
import { handleError } from '../shared/handlers';
import { default as settings } from '../shared/defaults';

const log = getLogger('ChainDaemon');

export default class ChainDaemon {
  static path = settings.isDevelopment
    ? path.resolve(__dirname, '../chain/chain-daemon.js')
    : path.resolve(process.resourcesPath, 'app/src/chain-daemon.prod.js');

  static execPath = settings.isDevelopment
    ? 'babel-node'
    : path.resolve(process.resourcesPath, '../usr/lib/electron/electron');

  subprocess = undefined;

  handlers = [];

  launch() {
    log.info(
      {
        dirname: __dirname,
        path: ChainDaemon.path,
        execPath: ChainDaemon.execPath,
      },
      'Launching daemon'
    );

    this.subprocess = spawn('babel-node', [ChainDaemon.path], {
      stdio: ['pipe', 'inherit', 'inherit'],
    });

    this.subprocess.on('exit', () => this.fire('exit'));

    this.subprocess.on('error', (error) => {
      log.error({ errorMessage: error.message }, 'Unhandled error in Chain Daemon');
      handleError(error);
    });

    this.on('exit', this.quit);
  }

  quit() {
    log.info('Shutting down ChainDaemon...');
    if (process.platform === 'win32') {
      try {
        execSync(`taskkill /pid ${this.subprocess.pid} /t /f`);
      } catch (error) {
        log.error(error.message);
      }
    } else {
      if (typeof this.subprocess !== 'undefined') {
        this.subprocess.kill();
      } else {
        log.warn('Unable to kill ChainDamon.  Process unknown.');
      }
    }
    log.info('ChainDaemon shut down.');
  }

  startMainProcessListeners = () => {
    try {
      let statusListenerInitialized = false;

      let statusIntervalId = null;

      const queue = eventsQueue('event_queue');

      // Closure to clear the current status interval
      const clearStatusInterval = () => {
        if (statusIntervalId) {
          clearInterval(statusIntervalId);
        }
      };

      // Closure to create a new status interval
      const generateStatusCheckInterval = (event, pingInterval) => {
        if (!pingInterval) {
          throw new Error('Cannot create a status interval with bad `pingInterval`');
        }
        // Clear out any previous interval
        clearStatusInterval();
        // Closure to poll for the status information
        const statusPoller = async () => {
          try {
            const status = await queue.status();
            // Determine whether or not to change up the interval to be a
            // little quicker if we are currently in the middle of processing
            event.sender.send('queue-status-data', JSON.stringify(status));
            log.debug({ status }, 'Emitted queue status');
          } catch (err) {
            if (err && err.message && err.message.indexOf('SQLITE_BUSY') > -1) {
              log.debug('DB locked and unable to get status');
            } else {
              throw err;
            }
          }
        };
        // Emit status indicator every 10 seconds
        statusIntervalId = setInterval(statusPoller, pingInterval);
        log.info({ pingInterval }, 'Spawning queue status listener');
        statusListenerInitialized = true;
        // Call once
        return statusPoller();
      };

      // Add interval that emits the status information out on the ipc main process for a renderer to pick up
      ipcMain.on('spawn-queue-status-listener', (event, pingInterval) => {
        return generateStatusCheckInterval(event, pingInterval);
      });

      ipcMain.on('change-queue-status-interval', (event, pingInterval) => {
        if (statusListenerInitialized) {
          return generateStatusCheckInterval(event, pingInterval);
        }
      });
    } catch (err) {
      log.error(err);
      return null;
    }
  };

  // Follows the publish/subscribe pattern

  // Subscribe method
  on(event, handler, context = handler) {
    this.handlers.push({ event, handler: handler.bind(context) });
  }

  // Publish method
  fire(event, args) {
    this.handlers.forEach((topic) => {
      if (topic.event === event) topic.handler(args);
    });
  }
}
