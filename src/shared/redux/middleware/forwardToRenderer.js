import { webContents } from 'electron';

const forwardToRenderer = () => (next) => (action) => {
  if (action.meta && action.meta.scope === 'local') {
    return next(action);
  }

  // change scope to avoid endless-loop
  const rendererAction = {
    ...action,
    meta: {
      ...action.meta,
      scope: 'local',
    },
  };

  const allWebContents = webContents.getAllWebContents();

  allWebContents.forEach((contents) => {
    contents.send('redux-action', rendererAction);
  });

  return next(action);
};

export default forwardToRenderer;
