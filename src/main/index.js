import { app } from 'electron';
import installExtensions from './installExtensions';
import windowConfig from './windowConfig';
import createStore from './createStore';
import createTray from './createTray';
import createWindow from './createWindow';
import { db } from './backend/db';
import seed from './backend/seed';

const isDevelopment = process.env.NODE_ENV === 'development';

// Just for remote loading the initial client state
global.state = {};

// Initialize some globals so they dont get garbage collected
let mainWindow = null;
let api = null;
let store = null;
let tray = null;
let testSeed = true;

const onReady = async () => {
  if (isDevelopment) {
    await installExtensions();
  }
  
  // Test seeding of db
  if (testSeed && db) {
    seed(db);
  }

  // Setup node based redux store that will act as our source of truth
  store = createStore();

  // Create main window
  mainWindow = createWindow({ config: windowConfig, isDevelopment });

  // Create tray icon
  tray = createTray(mainWindow);
};

const onWindowClosed = () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
};

// Event Handlers

app.on('ready', onReady);
app.on('window-all-closed', onWindowClosed);

export { db };
