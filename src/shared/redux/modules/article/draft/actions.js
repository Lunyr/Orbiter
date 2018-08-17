import { editorStateToJSON } from 'megadraft';

const actions = {
  SET_EDITOR_STATE: 'draft/SET_EDITOR_STATE',
  SET_TITLE: 'draft/SET_TITLE',
};

export const setDraftEditorState = (editorState) => ({
  meta: {
    scope: 'local',
  },
  type: actions.SET_EDITOR_STATE,
  payload: { editorState: editorStateToJSON(editorState) },
});

export const setDraftTitle = (title) => ({
  meta: {
    scope: 'local',
  },
  type: actions.SET_TITLE,
  payload: { title },
});

export default actions;
