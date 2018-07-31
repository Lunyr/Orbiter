import { app } from 'electron';
import findProcess from 'find-process';
import installExtensions from './installExtensions';
import windowConfig from './windowConfig';
import createStore from './createStore';
import createTray from './createTray';
import createWindow from './createWindow';
import { db } from '../backend/db';
import seed from '../backend/seed';
import settings from '../shared/settings';
import { getLogger, Raven } from '../lib/logger';
import ChainDaemon from './ChainDaemon';

const log = getLogger('orbiter');
const isDevelopment = process.env.NODE_ENV === 'development';

// Just for remote loading the initial client state
global.state = {};

// Initialize some globals so they dont get garbage collected
let mainWindow = null;
let api = null;
let store = null;
let tray = null;
let testSeed = true;
let chainDaemon = null;

const onReady = async () => {
  if (isDevelopment) {
    await installExtensions();
  }
  
  // Test seeding of db
  if (testSeed && db) {
    try {
      await seed(db);
    } catch (err) {
      if (err.message.indexOf('already exists') > -1) {
        log.info("Database already created");
      } else {
        throw err;
      }
    }
  }

  // Setup node based redux store that will act as our source of truth
  store = createStore();

  // Create main window
  mainWindow = createWindow({ config: windowConfig, isDevelopment });

  // Create tray icon
  //tray = createTray(mainWindow);

  // Start the daemon
  const processList = await findProcess('name', 'chain-daemon');
  if (isDevelopment) console.log("Process list: ", processList);
  const isDaemonRunning = processList.length > 0;
  if (!isDaemonRunning) {
    chainDaemon = new ChainDaemon();
    chainDaemon.on('exit', () => {
      if (!settings.isDevelopment) {
        chainDaemon = null;
      }
    });
    chainDaemon.launch();
  }
};

const onWindowClosed = () => {
  // Why is this excluded for darwin?
  if (process.platform !== 'darwin') {
    app.quit();
  }
};

/**
 * Kill hardware acceleration on linux.  Window won't ever load/render so the
 * window won't show.  The cause is currently unknown, but possibly related to
 * one of these issues: 
 *  - https://github.com/electron/electron/issues/9485
 *  - https://github.com/resin-io/resin-electronjs/issues/69
 */
if (process.platform === 'linux') {
  log.info("Disabling hardware acceleration on Linux systems");
  app.disableHardwareAcceleration();
}

// Event Handlers

app.on('ready', onReady);
app.on('window-all-closed', (e) => { 
  console.log("WINDOW-ALL-CLOSED");
  onWindowClosed();
});
app.on("before-quit", (e) => { console.log("BEFORE-QUIT") });
app.on("will-quit", (e) => { 
  console.log("WILL-QUIT"); 
  chainDaemon.quit();
});
app.on("quit", (e) => { console.log("QUIT") });

process.on('uncaughtException', (error) => {
  if (isDevelopment) console.log(error);
  log.error({ errMsg: error.message }, "Unhandled error in Orbiter!");
});

export { db };
