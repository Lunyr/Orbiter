import actions from './actions';

const initialState = {
  error: null,
  loading: false,
  data: [],
};

const searchReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case `${actions.QUERY}_START`:
      return {
        ...state,
        data: null,
        loading: true,
      };

    case `${actions.QUERY}_SUCCESS`:
      return {
        ...state,
        data: payload.data,
        loading: false,
      };

    case `${actions.QUERY}_ERROR`:
      return {
        ...state,
        data: [],
        error: payload,
        loading: false,
      };

    default:
      return state;
  }
};

export default searchReducer;
