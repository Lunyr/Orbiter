import get from 'lodash/get';
import actions from './actions';

const initialState = {
  transaction: {
    error: null,
    processing: false,
    data: null,
    responseId: null,
  },
};

const chainReducer = (state = initialState, action) => {
  const { meta, type, payload } = action;
  switch (type) {
    case `${actions.SEND_TRANSACTION}_START`: {
      return {
        ...state,
        transaction: {
          ...state.transaction,
          error: null,
          processing: true,
          data: null,
          responseId: get(meta, ['action', 'meta', 'responseId']),
        },
      };
    }

    case `${actions.SEND_TRANSACTION}_SUCCESS`: {
      return {
        ...state,
        transaction: {
          ...state.transaction,
          error: null,
          processing: false,
          ...payload,
        },
      };
    }

    case `${actions.SEND_TRANSACTION}_ERROR`: {
      return {
        ...state,
        transaction: {
          error: payload,
          processing: false,
          data: null,
          responseId: null,
        },
      };
    }

    default:
      return state;
  }
};

export default chainReducer;
