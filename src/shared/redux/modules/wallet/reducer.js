import actions from './actions';

const initialState = {
  address: null,
  balances: null,
  rewards: null,
  isFetching: false,
  error: null,
};

const walletReducer = (state = initialState, action) => {
  const { type, payload, error } = action;
  if (error) {
    return state;
  }
  switch (type) {
    case `${actions.FETCH_ACCOUNT_INFORMATION}_START`: {
      return {
        ...state,
        isFetching: true,
        address: null,
        balances: null,
        rewards: null,
      };
    }

    case `${actions.FETCH_ACCOUNT_INFORMATION}_SUCCESS`: {
      return {
        ...state,
        isFetching: false,
        ...payload.data,
      };
    }

    case `${actions.FETCH_ACCOUNT_INFORMATION}_ERROR`: {
      return {
        ...state,
        isFetching: false,
        error: payload,
        address: null,
        balances: null,
        rewards: null,
      };
    }

    default:
      return state;
  }
};

export default walletReducer;
