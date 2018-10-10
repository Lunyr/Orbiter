import { app, BrowserWindow, Menu } from 'electron';
import findProcess from 'find-process';
import installExtensions from './main/installExtensions';
import windowConfig from './main/windowConfig';
import createStore from './main/createStore';
import { getLogger } from './lib/logger';
import ChainDaemon from './main/ChainDaemon';
import MenuBuilder from './main/menu';
import { db } from './backend/db';

const log = getLogger('orbiter');
const isDevelopment = process.env.NODE_ENV === 'development';

// Just for remote loading the initial client state
global.state = {};

// Store references to initialized contracts
global.contracts = {};

// Store reference of initialized web3 instance
global.web3 = null;

// Initialize some globals so they dont get garbage collected
let mainWindow = null;
let store = null;
let chainDaemon = null;
let forceQuit = true;

// Source maps in prod
if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

// Add in electron debug
if (true) {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'src', 'node_modules');
  require('module').globalPaths.push(p);
}

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const readyHandler = async () => {
  // Add in development tooling
  if (true) {
    await installExtensions();
  }

  // Seed database
  try {
    const seed = require('./backend/seed').default;
    await seed(db);
  } catch (err) {
    if (err.message.indexOf('already exists') > -1) {
      log.info('Database already created');
    } else {
      throw err;
    }
  }

  // Start the daemon
  const processList = await findProcess('name', 'chain-daemon');
  const isDaemonRunning = processList.length > 0;

  if (!isDaemonRunning && typeof process.env.DISABLE_DAEMON === 'undefined') {
    chainDaemon = new ChainDaemon();

    chainDaemon.on('exit', () => {
      if (!isDevelopment) {
        chainDaemon = null;
      }
    });

    chainDaemon.launch();
    chainDaemon.startMainProcessListeners();
  }

  // Setup node based redux store that will act as our source of truth
  store = createStore();

  // Create main window
  mainWindow = new BrowserWindow(windowConfig);

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // show window once on first load
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }

    if (process.platform === 'darwin') {
      mainWindow.on('close', function(e) {
        if (!forceQuit) {
          e.preventDefault();
          mainWindow.hide();
        }
      });

      app.on('activate', () => {
        mainWindow.show();
      });

      app.on('before-quit', () => {
        forceQuit = true;
      });
    }
  });

  mainWindow.webContents.on('crashed', (err, killed) => {
    if (chainDaemon) chainDaemon.quit();
    log.error({ err, killed }, 'CRASHED');
  });

  mainWindow.webContents.on('did-fail-load', (err, errCode, errDesc) => {
    log.error({ err, errCode, errDesc }, 'FAILED TO LOAD');
    // Attempt to reload the url again
    if (mainWindow) {
      mainWindow.loadURL(`file://${__dirname}/index.html`);
    }
  });

  mainWindow.webContents.on('unresponsive', () => {
    log.info('UNRESPONSIVE');
  });

  mainWindow.webContents.on('destroyed', () => {
    if (chainDaemon) chainDaemon.quit();
    log.info('DESTROYED');
  });

  mainWindow.webContents.on('plugin-crashed', (err, name, vers) => {
    log.error({ err, name, vers }, 'PLUGIN CRASHED');
  });

  if (isDevelopment) {
    // auto-open dev tools
    mainWindow.webContents.openDevTools();
    // add inspect element on right click menu
    mainWindow.webContents.on('context-menu', (e, props) => {
      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click() {
            mainWindow.inspectElement(props.x, props.y);
          },
        },
      ]).popup(mainWindow);
    });
  }

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
};

app.on('ready', readyHandler);
