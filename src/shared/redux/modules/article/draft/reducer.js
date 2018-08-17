import actions from './actions';

const initialState = {
  editorState: null,
  title: null,
};

const draftReducer = (state = initialState, action) => {
  const { type, payload, error } = action;
  if (error) {
    return state;
  }
  switch (type) {
    case actions.SET_EDITOR_STATE:
    case actions.SET_TITLE: {
      return {
        ...state,
        ...payload,
      };
    }

    default:
      return state;
  }
};

export default draftReducer;
