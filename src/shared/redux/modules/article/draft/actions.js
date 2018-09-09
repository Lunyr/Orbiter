const actions = {
  PERSIST_EDITOR_STATE: 'draft/PERSIST_EDITOR_STATE',
  SET_TITLE: 'draft/SET_TITLE',
};

export const persistDraftEditorState = (editorState) => ({
  meta: {
    scope: 'local',
  },
  type: actions.PERSIST_EDITOR_STATE,
  payload: { editorState },
});

export const setDraftTitle = (title) => ({
  meta: {
    scope: 'local',
  },
  type: actions.SET_TITLE,
  payload: { title },
});

export default actions;
