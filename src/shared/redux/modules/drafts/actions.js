import createTriggerAlias from '../../helpers/createTriggerAlias';
import { getDrafts } from '../../../../backend/api';

const actions = {
  FETCH: 'drafts/FETCH',
};

export const fetchDrafts = createTriggerAlias(actions.FETCH, () => ({
  type: actions.FETCH,
  payload: getDrafts(),
}));

export default actions;
