import actions from './actions';

const initialState = {
  data: null,
  creating: false,
  loading: false,
  saving: false,
  error: null,
};

const draftReducer = (state = initialState, action) => {
  const { type, payload, error } = action;
  if (error) {
    return state;
  }
  switch (type) {
    case actions.SET_PARAMS:
    case actions.SET_TITLE: {
      return {
        ...state,
        data: {
          ...state.data,
          ...payload,
        },
      };
    }

    case actions.CLEAR: {
      return initialState;
    }

    case `${actions.FETCH}_START`: {
      return {
        ...state,
        loading: true,
        error: null,
        data: null,
      };
    }

    case `${actions.FETCH}_SUCCESS`: {
      return {
        ...state,
        loading: false,
        data: payload.data,
      };
    }

    case `${actions.FETCH}_ERROR`: {
      return {
        ...state,
        loading: false,
        error: payload,
      };
    }

    case `${actions.CREATE}_START`: {
      return {
        ...state,
        creating: true,
        error: null,
        data: null,
      };
    }

    case `${actions.CREATE}_SUCCESS`: {
      return {
        ...state,
        creating: false,
        data: payload.data,
      };
    }

    case `${actions.CREATE}_ERROR`: {
      return {
        ...state,
        creating: false,
        error: payload,
      };
    }

    case `${actions.SAVE}_START`: {
      return {
        ...state,
        saving: true,
        error: null,
      };
    }

    case `${actions.SAVE}_SUCCESS`: {
      return {
        ...state,
        saving: false,
      };
    }

    case `${actions.SAVE}_ERROR`: {
      return {
        ...state,
        saving: false,
        error: payload,
      };
    }

    default:
      return state;
  }
};

export default draftReducer;
