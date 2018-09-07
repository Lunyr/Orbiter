import packageJson from '../../../../../package.json';
import actions from './actions';

const initialState = {
  connecting: true,
  loading: false,
  headerHeight: 70,
  footerHeight: 70,
  name: 'Orbiter',
  sidebarWidth: 175,
  version: process.env.BUILD_TAG || packageJson.version,
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
        ...payload.data,
      };
    }

    case `${actions.CONNECT_WEB3}_ERROR`: {
      return {
        ...state,
        connecting: false,
      };
    }

    default:
      return state;
  }
};

export default appReducer;
