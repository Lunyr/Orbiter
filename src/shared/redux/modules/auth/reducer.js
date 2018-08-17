import actions from './actions';

const initialState = {
  isLoggingIn: false,
  isRegistering: false,
  isLoggedIn: false,
  account: null,
};

const authReducer = (state = initialState, action) => {
  const { type, payload, error } = action;
  if (error) {
    return state;
  }
  switch (type) {
    case `${actions.REGISTER}_START`: {
      return {
        ...state,
        isRegistering: true,
      };
    }

    case `${actions.REGISTER}_SUCCESS`: {
      return {
        ...state,
        account: payload.data,
        isRegistering: false,
        isLoggedIn: true,
      };
    }

    case `${actions.REGISTER}_ERROR`: {
      return {
        ...state,
        isRegistering: false,
      };
    }

    case `${actions.LOGIN}_START`: {
      return {
        ...state,
        isLoggingIn: true,
      };
    }

    case `${actions.LOGIN}_SUCCESS`: {
      return {
        ...state,
        account: payload.data,
        isLoggingIn: false,
        isLoggedIn: true,
      };
    }

    case `${actions.LOGIN}_ERROR`: {
      return {
        ...state,
        error: payload.error,
        isLoggingIn: false,
        isLoggedIn: false,
      };
    }

    case actions.LOGOUT: {
      return {
        ...state,
        account: null,
        isLoggedIn: false,
      };
    }

    default:
      return state;
  }
};

export default authReducer;
