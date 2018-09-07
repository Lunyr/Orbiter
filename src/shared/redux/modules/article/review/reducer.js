import actions from './actions';

const initialState = {
  data: null,
  isFetching: false,
  error: null,
  eligibility: {
    isChecking: false,
    canReview: false,
    reason: null,
    error: null,
  },
};

const reviewReducer = (state = initialState, action) => {
  const { type, payload, error } = action;
  if (error) {
    return state;
  }
  switch (type) {
    case `${actions.FETCH}_START`:
      return {
        ...state,
        isFetching: true,
      };

    case `${actions.FETCH}_SUCCESS`:
      return {
        ...state,
        data: payload.data,
        error: '',
        isFetching: false,
      };

    case `${actions.FETCH}_ERROR`:
      return {
        ...state,
        error: payload,
        data: [],
        isFetching: false,
      };

    case `${actions.CHECK_VOTING_ELIGIBILITY}_START`:
      return {
        ...state,
        eligibility: {
          ...state.eligibility,
          isChecking: true,
        },
      };

    case `${actions.CHECK_VOTING_ELIGIBILITY}_SUCCESS`:
      return {
        ...state,
        eligibility: {
          ...state.eligibility,
          isChecking: false,
          ...payload,
        },
      };

    case `${actions.CHECK_VOTING_ELIGIBILITY}_ERROR`:
      return {
        ...state,
        eligibility: {
          ...state.eligibility,
          isChecking: false,
          error: payload,
          canReview: false,
        },
      };

    default:
      return state;
  }
};

export default reviewReducer;
