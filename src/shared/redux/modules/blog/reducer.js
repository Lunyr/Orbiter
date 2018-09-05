import actions from './actions';

const initialState = {
  english: [],
  chinese: [],
  korean: [],
  selectedPost: null,
  isFetchingPosts: false,
};

const blogReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${actions.FETCH}_START`:
      return {
        ...state,
        isFetchingPosts: true,
      };

    case `${actions.FETCH}_SUCCESS`:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default blogReducer;
