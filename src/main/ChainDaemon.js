import path from 'path';
import { spawn, execSync } from 'child_process';
import { getLogger, Raven } from '../lib/logger';

const log = getLogger('ChainDaemon');

export default class ChainDaemon {
  static path = __dirname + '/../chain/chain-daemon.js';
  subprocess;
  handlers;

  constructor() {
    this.handlers = [];
  }

  launch() {
    log.info({ dirname: __dirname, path: ChainDaemon.path }, 'Launching daemon');
    
    this.subprocess = spawn('node', [ChainDaemon.path], { stdio: ['pipe','inherit','inherit'] });

    this.subprocess.on('exit', () => this.fire('exit'));
    this.subprocess.on('error', error => console.log(`ChainDaemon: ${error}`));

    this.on('exit', this.quit);
  }

  quit() {
    log.info("Shutting down ChainDaemon...");
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
        log.warn("Unable to kill ChainDamon.  Process unknown.");
      }
    }
    log.info("ChainDaemon shut down.");
  }

  // Follows the publish/subscribe pattern

  // Subscribe method
  on(event, handler, context = handler) {
    this.handlers.push({ event, handler: handler.bind(context) });
  }

  // Publish method
  fire(event, args) {
    this.handlers.forEach(topic => {
      if (topic.event === event) topic.handler(args);
    });
  }
}