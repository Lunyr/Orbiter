import { ipcMain } from 'electron';

export default function replayMainAction(store) {
  /**
   * Give renderers a way to sync the current state of the store
   * Refer to https://github.com/electron/electron/blob/master/docs/api/remote.md#remote-objects
   */
  global.getReduxState = () => JSON.stringify(store.getState());

  ipcMain.on('redux-action', (event, payload) => {
    store.dispatch(payload);
  });
}
