import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';

let forceQuit = false;

export default ({ config, isDevelopment }) => {
  let browserWindow = new BrowserWindow(config);
  let menu;
  let template;

  // Load application file
  browserWindow.loadFile(path.resolve(path.join(__dirname, '../renderer/index.html')));

  // show window once on first load
  browserWindow.webContents.once('did-finish-load', () => {
    browserWindow.show();
  });

  browserWindow.webContents.on('crashed', (e, killed) => {
    console.log("OOOOHHHHH NOOO!!!!", e, killed);
  });

  browserWindow.webContents.on('did-fail-load', (e, errCode, errDesc) => {
    console.log("OOOOHHHHH NOOO", e, errCode, errDesc);
  });

  browserWindow.webContents.on('unresponsive', () => {
    console.log("UNRESPONSIVE");
  });

  browserWindow.webContents.on('destroyed', () => {
    console.log("DESTROYED");
  });

  browserWindow.webContents.on('plugin-crashed', (e, name, vers) => {
    console.log("PLUGIN CRASHED", e, name, vers);
  });

  browserWindow.webContents.on('did-finish-load', () => {
    // Handle window logic properly on macOS:
    // 1. App should not terminate if window has been closed
    // 2. Click on icon in dock should re-open the window
    // 3. ⌘+Q should close the window and quit the app
    if (process.platform === 'darwin') {
      browserWindow.on('close', function(e) {
        if (!forceQuit) {
          e.preventDefault();
          browserWindow.hide();
        }
      });

      app.on('activate', () => {
        browserWindow.show();
      });

      app.on('before-quit', () => {
        forceQuit = true;
      });
    } else {
      browserWindow.on('closed', () => {
        browserWindow = null;
      });
    }
  });

  // Create window menu
  if (process.platform === 'darwin') {
    template = [
      {
        label: 'Lunyr Orbiter',
        submenu: [
          {
            label: 'About',
          },
          {
            type: 'separator',
          },
          {
            label: 'Services',
            submenu: [],
          },
          {
            type: 'separator',
          },
          {
            label: 'Hide',
            accelerator: 'Command+H',
            selector: 'hide:',
          },
          {
            label: 'Hide Others',
            accelerator: 'Command+Shift+H',
            selector: 'hideOtherApplications:',
          },
          {
            label: 'Show All',
            selector: 'unhideAllApplications:',
          },
          {
            type: 'separator',
          },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click() {
              app.quit();
            },
          },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Undo',
            accelerator: 'Command+Z',
            selector: 'undo:',
          },
          {
            label: 'Redo',
            accelerator: 'Shift+Command+Z',
            selector: 'redo:',
          },
          {
            type: 'separator',
          },
          {
            label: 'Cut',
            accelerator: 'Command+X',
            selector: 'cut:',
          },
          {
            label: 'Copy',
            accelerator: 'Command+C',
            selector: 'copy:',
          },
          {
            label: 'Paste',
            accelerator: 'Command+V',
            selector: 'paste:',
          },
          {
            label: 'Select All',
            accelerator: 'Command+A',
            selector: 'selectAll:',
          },
        ],
      },
      {
        label: 'View',
        submenu: isDevelopment
          ? [
              {
                label: 'Reload',
                accelerator: 'Command+R',
                click() {
                  browserWindow.webContents.reload();
                },
              },
              {
                label: 'Toggle Full Screen',
                accelerator: 'Ctrl+Command+F',
                click() {
                  browserWindow.setFullScreen(!browserWindow.isFullScreen());
                },
              },
              {
                label: 'Toggle Developer Tools',
                accelerator: 'Alt+Command+I',
                click() {
                  browserWindow.toggleDevTools();
                },
              },
            ]
          : [
              {
                label: 'Toggle Full Screen',
                accelerator: 'Ctrl+Command+F',
                click() {
                  browserWindow.setFullScreen(!browserWindow.isFullScreen());
                },
              },
            ],
      },
      {
        label: 'Window',
        submenu: [
          {
            label: 'Minimize',
            accelerator: 'Command+M',
            selector: 'performMiniaturize:',
          },
          {
            label: 'Close',
            accelerator: 'Command+W',
            selector: 'performClose:',
          },
          {
            type: 'separator',
          },
        ],
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Learn More',
          },
          {
            label: 'Documentation',
          },
          {
            label: 'Search Issues',
          },
        ],
      },
    ];

    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  if (isDevelopment) {
    // auto-open dev tools
    browserWindow.webContents.openDevTools();
    // add inspect element on right click menu
    browserWindow.webContents.on('context-menu', (e, props) => {
      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click() {
            browserWindow.inspectElement(props.x, props.y);
          },
        },
      ]).popup(browserWindow);
    });
  }
  return browserWindow;
};
