import { app, Menu, Tray } from 'electron';
import path from 'path';

export default (window) => {
  let iconPath;
  switch (process.platform) {
    case 'darwin': {
      iconPath = path.join(__dirname, '/img/tray/mac/iconTemplate.png');
      break;
    }
    case 'win32': {
      iconPath = path.join(__dirname, '/img/tray/windows/tray.ico');
      break;
    }
    default: {
      iconPath = path.join(__dirname, '/img/tray/default/tray.png');
    }
  }

  const tray = new Tray(iconPath);

  tray.on('double-click', () => {
    window.show();
  });

  tray.setToolTip('Lunyr Orbiter App');

  const template = [
    {
      label: `Open ${app.getName()}`,
      click: () => {
        window.show();
      },
    },
    { role: 'quit' },
  ];
  const contextMenu = Menu.buildFromTemplate(template);
  tray.setContextMenu(contextMenu);

  return tray;
};
