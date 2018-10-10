import actions from './actions';

const initialState = {
  data: [],
  error: null,
  loading: false,
};

const advertisingReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case `${actions.FETCH}_START`:
      return {
        ...state,
        error: null,
        data: [],
        loading: true,
      };

    case `${actions.FETCH}_SUCCESS`:
      return {
        ...state,
        ...payload,
        loading: false,
      };

    case `${actions.FETCH}_ERROR`:
      return {
        ...state,
        ...state,
        error: payload,
        loading: false,
      };

    default:
      return state;
  }
};

export default advertisingReducer;
