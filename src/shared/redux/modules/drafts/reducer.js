import actions from './actions';

const initialState = {
  error: null,
  data: [],
  loading: false,
};

const draftsReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case `${actions.FETCH}_START`: {
      return {
        ...state,
        loading: true,
      };
    }

    case `${actions.FETCH}_SUCCESS`: {
      return {
        ...state,
        data: payload.data,
        loading: false,
      };
    }

    case `${actions.FETCH}_ERROR`: {
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

export default draftsReducer;
