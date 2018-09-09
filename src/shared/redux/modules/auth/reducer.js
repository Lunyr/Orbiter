import actions from './actions';

const initialState = {
  loginError: '',
  accountsError: '',
  isLoggingIn: false,
  isRegistering: false,
  isLoggedIn: false,
  account: null,
  accounts: [],
};

const authReducer = (state = initialState, action) => {
  const { type, payload, error } = action;
  if (error) {
    return state;
  }
  switch (type) {
    case `${actions.GET_ACCOUNTS}_START`: {
      return {
        ...state,
        isGettingAccounts: true,
      };
    }

    case `${actions.GET_ACCOUNTS}_SUCCESS`: {
      return {
        ...state,
        accounts: payload.data,
        isGettingAccounts: false,
      };
    }

    case `${actions.GET_ACCOUNTS}_ERROR`: {
      return {
        ...state,
        accountsError: payload,
        isGettingAccounts: false,
      };
    }
    case `${actions.REGISTER}_START`: {
      return {
        ...state,
        account: null,
        isRegistering: true,
      };
    }

    case `${actions.REGISTER}_SUCCESS`: {
      return {
        ...state,
        account: payload.address,
        isRegistering: false,
        isLoggedIn: true,
      };
    }

    case `${actions.REGISTER}_ERROR`: {
      return {
        ...state,
        isRegistering: false,
        account: null,
      };
    }

    case `${actions.LOGIN}_START`: {
      return {
        ...state,
        loginError: '',
        isLoggingIn: true,
      };
    }

    case `${actions.LOGIN}_SUCCESS`: {
      return {
        ...state,
        account: payload.address,
        isLoggingIn: false,
        isLoggedIn: true,
      };
    }

    case `${actions.LOGIN}_ERROR`: {
      // TODO: Why isn't payload.message available on the render thread?
      return {
        ...state,
        loginError: payload.message || payload.error || 'Login failed',
        isLoggingIn: false,
        isLoggedIn: false,
      };
    }

    case `${actions.IMPORT_FROM_API}_START`: {
      return {
        ...state,
        importError: '',
        isImportingFromAPI: true,
        account: null,
      };
    }

    case `${actions.IMPORT_FROM_API}_SUCCESS`: {
      return {
        ...state,
        importError: '',
        isImportingFromAPI: false,
        account: payload,
      };
    }

    case `${actions.IMPORT_FROM_API}_ERROR`: {
      return {
        ...state,
        importError: payload.message || payload.error || 'Authentication failed',
        isImportingFromAPI: false,
        account: null,
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
