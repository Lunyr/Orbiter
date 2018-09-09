import packageJson from '../../../../../package.json';
import actions from './actions';

const initialState = {
  connecting: true,
  connected: false,
  headerHeight: 70,
  footerHeight: 70,
  name: 'Orbiter',
  network: null,
  sidebarWidth: 175,
  version: process.env.BUILD_TAG || packageJson.version,
  queue: {
    syncing: false,
    total: 0,
    complete: 0,
    percentComplete: 100,
    pollIntervalMS: 60000,
  },
};

const appReducer = (state = initialState, action) => {
  const { type, payload, error } = action;
  if (error) {
    return state;
  }
  switch (type) {
    case `${actions.CONNECT_WEB3}_START`: {
      return {
        ...state,
        connecting: true,
      };
    }

    case `${actions.CONNECT_WEB3}_SUCCESS`: {
      return {
        ...state,
        connecting: false,
        connected: true,
        ...payload.data,
      };
    }

    case `${actions.CONNECT_WEB3}_ERROR`: {
      return {
        ...state,
        connecting: false,
      };
    }

    case actions.UPDATE_QUEUE_STATUS:
    case actions.SET_QUEUE_SYNCING: {
      return {
        ...state,
        queue: {
          ...state.queue,
          ...payload,
        },
      };
    }

    default:
      return state;
  }
};

export default appReducer;
