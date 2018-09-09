import actions from './actions';

const initialState = {
  data: null,
  isFetching: false,
  error: null,
  eligibility: {
    isChecking: false,
    isEligibleToVote: false,
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
          ...payload.data,
          isChecking: false,
        },
      };

    case `${actions.CHECK_VOTING_ELIGIBILITY}_ERROR`:
      return {
        ...state,
        eligibility: {
          ...state.eligibility,
          isChecking: false,
          error: payload,
          isEligibleToVote: false,
        },
      };

    default:
      return state;
  }
};

export default reviewReducer;
