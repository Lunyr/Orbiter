import actions from './actions';

const initialState = {
  draftId: null,
  editorState: null,
  title: null,
};

const draftReducer = (state = initialState, action) => {
  const { type, payload, error } = action;
  if (error) {
    return state;
  }
  switch (type) {
    case actions.PERSIST_EDITOR_STATE:
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
