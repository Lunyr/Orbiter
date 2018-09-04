import actions from './actions';

const initialState = {
  error: '',
  isFetching: false,
  feed: [],
  filter: '',
  filterTypes: [
    {
      value: 'article',
      label: 'Accepted Articles',
    },
    {
      value: 'review',
      label: 'Reviewed Articles',
    },
    {
      value: 'vote',
      label: 'Voted On',
    },
  ],
};

const feedReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actions.SET_FILTER:
      return {
        ...state,
        ...payload,
      };

    case `${actions.FETCH_MORE}_START`:
      return {
        ...state,
        isFetchingMore: true,
      };

    case `${actions.FETCH_MORE}_SUCCESS`:
      return {
        ...state,
        error: '',
        feed: [...state.feed, ...payload.data.feed],
        isFetchingMore: true,
      };

    case `${actions.FETCH_MORE}_ERROR`:
      return {
        ...state,
        error: payload,
        isFetchingMore: true,
      };

    case `${actions.FETCH}_START`:
      return {
        ...state,
        isFetching: true,
      };

    case `${actions.FETCH}_SUCCESS`:
      return {
        ...state,
        feed: payload.data,
        error: '',
        isFetching: false,
      };

    case `${actions.FETCH}_ERROR`:
      return {
        ...state,
        error: payload,
        feed: [],
        filter: '',
        isFetching: false,
      };

    default:
      return state;
  }
};

export default feedReducer;
