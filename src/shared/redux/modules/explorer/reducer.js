import actions from './actions';

const initialState = {
  error: null,
  data: [],
  loading: false,
};

const explorerReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case `${actions.FETCH_ARTICLES}_START`: {
      return {
        ...state,
        loading: true,
      };
    }

    case `${actions.FETCH_ARTICLES}_SUCCESS`: {
      return {
        ...state,
        data: payload.data,
        loading: false,
      };
    }

    case `${actions.FETCH_ARTICLES}_ERROR`: {
      return {
        ...state,
        error: payload,
        loading: false,
      };
    }

    default:
      return state;
  }
};

export default explorerReducer;
