import {
  getDraft,
  createDraft as create,
  saveDraft as save,
  IpfsAPI,
} from '../../../../../backend/api';
import createTriggerAlias from '../../../helpers/createTriggerAlias';

const actions = {
  SET_TITLE: 'draft/SET_TITLE',
  CREATE: 'draft/CREATE',
  FETCH: 'draft/FETCH',
  SAVE: 'draft/SAVE',
  SET_PARAMS: 'draft/SET_PARAMS',
  UPLOAD_FILE: 'draft/UPLOAD_FILE',
  CLEAR: 'draft/CLEAR',
};

export const clearDraftState = () => ({
  meta: {
    scope: 'local',
  },
  type: actions.CLEAR,
});

export const setDraftParams = (params) => ({
  meta: {
    scope: 'local',
  },
  type: actions.SET_PARAMS,
  payload: params,
});

export const fetchDraft = createTriggerAlias(actions.FETCH, (uuid) => ({
  type: actions.FETCH,
  payload: getDraft(uuid),
}));

export const createDraft = createTriggerAlias(actions.CREATE, ({ account: address, uuid }) => ({
  type: actions.CREATE,
  payload: create({
    address,
    uuid,
  }),
}));

export const saveDraft = createTriggerAlias(actions.SAVE, (uuid, params) => ({
  type: actions.SAVE,
  payload: save(uuid, params),
}));

export const uploadFileToIPFS = createTriggerAlias(actions.UPLOAD_FILE, (file) => ({
  type: actions.UPLOAD_FILE,
  payload: IpfsAPI.uploadFile(file),
}));

export default actions;
