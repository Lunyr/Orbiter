import actions from './actions';

const initialState = {
  editorState: null,
  title: null,
};

const editorReducer = (state = initialState, action) => {
  const { type, payload, error } = action;
  if (error) {
    return state;
  }
  switch (type) {
    default:
      return state;
  }
};

export default editorReducer;
