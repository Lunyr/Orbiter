import actions from './actions';

const initialState = {
  data: null,
  isFetching: false,
  error: null,
};

const readerReducer = (state = initialState, action) => {
  const { type, payload, error } = action;
  if (error) {
    return state;
  }
  switch (type) {
    case `${actions.FETCH}_START`:
      return {
        ...state,
        data: null,
        isFetching: true,
      };

    case `${actions.FETCH}_SUCCESS`:
      return {
        ...state,
        data: payload.data,
        error: null,
        isFetching: false,
      };

    case `${actions.FETCH}_ERROR`:
      return {
        ...state,
        error: payload,
        data: null,
        isFetching: false,
      };

    default:
      return state;
  }
};

export default readerReducer;
