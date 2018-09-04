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

// Initialize some globals so they dont get garbage collected
let mainWindow = null;
let store = null;
let testSeed = false;
let chainDaemon = null;
let forceQuit = true;

// Source maps in prod
if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

// Add in electron debug
if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
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
  if (isDevelopment) {
    await installExtensions();
  }

  // Seed database
  if (testSeed && db) {
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
  }

  // Start the daemon
  const processList = await findProcess('name', 'chain-daemon');
  const isDaemonRunning = processList.length > 0;

  if (!isDaemonRunning) {
    chainDaemon = new ChainDaemon();

    chainDaemon.on('exit', () => {
      if (!isDevelopment) {
        chainDaemon = null;
      }
    });

    chainDaemon.launch();
  }

  // Setup node based redux store that will act as our source of truth
  store = createStore();

  console.log('aminWindow', mainWindow);

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

  mainWindow.webContents.on('crashed', (e, killed) => {
    console.log('CRASHED', e, killed);
  });

  mainWindow.webContents.on('did-fail-load', (e, errCode, errDesc) => {
    console.log('FAILED TO LOAD', e, errCode, errDesc);
  });

  mainWindow.webContents.on('unresponsive', () => {
    console.log('UNRESPONSIVE');
  });

  mainWindow.webContents.on('destroyed', () => {
    console.log('DESTROYED');
  });

  mainWindow.webContents.on('plugin-crashed', (e, name, vers) => {
    console.log('PLUGIN CRASHED', e, name, vers);
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
