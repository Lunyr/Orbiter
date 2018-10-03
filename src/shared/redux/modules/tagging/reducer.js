import actions from './actions';

const initialState = {
  error: null,
  fetching: false,
  filter: '',
  tags: [],
  // Initial selected tag group
  selected: 'a',
};

const taggingReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SELECT_GROUP: {
      return {
        ...state,
        ...action.payload,
      };
    }

    case `${actions.FETCH}_START`:
      return {
        ...state,
        error: null,
        fetching: true,
      };

    case `${actions.FETCH}_SUCCESS`:
      return {
        ...state,
        error: null,
        fetching: false,
        ...action.payload,
      };

    case `${actions.FETCH}_ERROR`:
      return {
        ...state,
        error: action.payload,
        fetching: false,
      };

    default:
      return state;
  }
};

export default taggingReducer;
