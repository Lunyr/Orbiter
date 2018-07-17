import packageJson from '../../../../../package.json';
import actions from './actions';

const initialState = {
  data: [],
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
    case `${actions.FETCH_TEST_DATA}_START`: {
      return {
        ...state,
        data: [],
        loading: true,
      };
    }

    case `${actions.FETCH_TEST_DATA}_SUCCESS`: {
      return {
        ...state,
        data: payload.data,
        loading: false,
      };
    }

    default:
      return state;
  }
};

export default appReducer;
