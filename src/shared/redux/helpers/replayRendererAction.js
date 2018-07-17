import { ipcRenderer } from 'electron';

export default function replayRendererAction(store) {
  ipcRenderer.on('redux-action', (event, payload) => {
    store.dispatch(payload);
  });
}
